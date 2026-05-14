import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Sparkles, X, MessageSquare } from 'lucide-react';

// --- Function Declarations for Gemini ---

const listServices: FunctionDeclaration = {
  name: "listServices",
  description: "Retrieve a list of all salon services including their IDs, names, categories, and prices.",
  parameters: { type: Type.OBJECT, properties: {} }
};

const addService: FunctionDeclaration = {
  name: "addService",
  description: "Add a new service to the salon menu.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name of the service" },
      category: { type: Type.STRING, description: "Category (e.g., Skin & Beauty, Hair Services, Makeup Services, Nail Services)" },
      description: { type: Type.STRING, description: "Detailed description of what the service includes" },
      startingPrice: { type: Type.NUMBER, description: "Starting price in INR (optional)" },
      excludeFromCombo: { type: Type.BOOLEAN, description: "If true, this service will not be eligible for multi-service discounts in the package builder." }
    },
    required: ["name", "category", "description"]
  }
};

const updateService: FunctionDeclaration = {
  name: "updateService",
  description: "Update an existing service's details.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "The unique ID of the service to update" },
      updates: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          startingPrice: { type: Type.NUMBER },
          excludeFromCombo: { type: Type.BOOLEAN }
        }
      }
    },
    required: ["id", "updates"]
  }
};

const deleteService: FunctionDeclaration = {
  name: "deleteService",
  description: "Remove a service from the salon menu.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "The unique ID of the service to delete" }
    },
    required: ["id"]
  }
};

const listPackages: FunctionDeclaration = {
  name: "listPackages",
  description: "Retrieve a list of all premium packages.",
  parameters: { type: Type.OBJECT, properties: {} }
};

const addPackage: FunctionDeclaration = {
  name: "addPackage",
  description: "Add a new premium package (combo).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Title of the package" },
      description: { type: Type.STRING, description: "Summary of the package" },
      price: { type: Type.NUMBER, description: "Discounted price in INR" },
      originalPrice: { type: Type.NUMBER, description: "Original total price before discount" },
      services: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of service names included in this package" },
      isPopular: { type: Type.BOOLEAN, description: "Tag as popular" },
      isBestValue: { type: Type.BOOLEAN, description: "Tag as best value" },
      image: { type: Type.STRING, description: "URL of the package image" }
    },
    required: ["title", "description", "price", "originalPrice", "services"]
  }
};

const updatePackage: FunctionDeclaration = {
  name: "updatePackage",
  description: "Update an existing package's details.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "The unique ID of the package to update" },
      updates: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          price: { type: Type.NUMBER },
          originalPrice: { type: Type.NUMBER },
          services: { type: Type.ARRAY, items: { type: Type.STRING } },
          isPopular: { type: Type.BOOLEAN },
          isBestValue: { type: Type.BOOLEAN },
          image: { type: Type.STRING }
        }
      }
    },
    required: ["id", "updates"]
  }
};

const deletePackage: FunctionDeclaration = {
  name: "deletePackage",
  description: "Remove a package from the inventory.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "The unique ID of the package to delete" }
    },
    required: ["id"]
  }
};

const updateItemSequence: FunctionDeclaration = {
  name: "updateItemSequence",
  description: "Update the sequence (order) of a service or package.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      collection: { type: Type.STRING, description: "Must be 'services', 'packages' or 'categories'" },
      id: { type: Type.STRING, description: "The unique ID of the item" },
      sequence: { type: Type.NUMBER, description: "The new sequence order" }
    },
    required: ["collection", "id", "sequence"]
  }
};

const deduplicateItems: FunctionDeclaration = {
  name: "deduplicateItems",
  description: "Identify and remove duplicate entries in a specific collection.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      collection: { type: Type.STRING, description: "The collection to clean (services, packages, or categories)" }
    },
    required: ["collection"]
  }
};

const tools = [
  {
    functionDeclarations: [
      listServices, addService, updateService, deleteService,
      listPackages, addPackage, updatePackage, deletePackage,
      updateItemSequence, deduplicateItems
    ]
  }
];

// --- Chat Component ---

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AdminAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Salon Assistant AI. I can help you manage services and packages. For example, you can say 'Add a new hair spa service for ₹1200' or 'List all my current packages'." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleToolCall = async (call: any) => {
    console.log("AI calling function:", call.name, call.args);
    
    try {
      switch (call.name) {
        case 'listServices': {
          const snapshot = await getDocs(query(collection(db, 'services'), orderBy('category')));
          return { services: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) };
        }
        case 'addService': {
          const docRef = await addDoc(collection(db, 'services'), {
            ...call.args,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
          return { success: true, id: docRef.id, message: "Service added successfully" };
        }
        case 'updateService': {
          await updateDoc(doc(db, 'services', call.args.id), {
            ...call.args.updates,
            updatedAt: Date.now()
          });
          return { success: true, message: "Service updated successfully" };
        }
        case 'deleteService': {
          await deleteDoc(doc(db, 'services', call.args.id));
          return { success: true, message: "Service deleted successfully" };
        }
        case 'listPackages': {
          const snapshot = await getDocs(query(collection(db, 'packages'), orderBy('updatedAt', 'desc')));
          return { packages: snapshot.docs.map(d => ({ id: d.id, ...d.data() })) };
        }
        case 'addPackage': {
          const docRef = await addDoc(collection(db, 'packages'), {
            ...call.args,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
          return { success: true, id: docRef.id, message: "Package added successfully" };
        }
        case 'updatePackage': {
          await updateDoc(doc(db, 'packages', call.args.id), {
            ...call.args.updates,
            updatedAt: Date.now()
          });
          return { success: true, message: "Package updated successfully" };
        }
        case 'updateItemSequence': {
          await updateDoc(doc(db, call.args.collection, call.args.id), {
            sequence: call.args.sequence,
            updatedAt: Date.now()
          });
          return { success: true, message: "Item sequence updated successfully" };
        }
        case 'deduplicateItems': {
          const colName = call.args.collection;
          const snapshot = await getDocs(collection(db, colName));
          const all = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
          const seen = new Set();
          const toDelete: string[] = [];
          
          all.forEach(item => {
              let key = "";
              if (colName === 'services') key = `${item.name.toLowerCase().trim()}_${item.category.toLowerCase().trim()}`;
              else if (colName === 'packages') key = item.title.toLowerCase().trim();
              else if (colName === 'categories') key = item.name.toLowerCase().trim();
              
              if (seen.has(key)) {
                  toDelete.push(item.id);
              } else {
                  seen.add(key);
              }
          });
          
          await Promise.all(toDelete.map(id => deleteDoc(doc(db, colName, id))));
          return { success: true, count: toDelete.length, message: `Removed ${toDelete.length} duplicates from ${colName}` };
        }
        case 'deletePackage': {
          await deleteDoc(doc(db, 'packages', call.args.id));
          return { success: true, message: "Package deleted successfully" };
        }
        default:
          return { error: "Unknown function" };
      }
    } catch (error: any) {
      console.error("Error in AI tool execution:", error);
      return { error: error.message };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const historyParts = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      historyParts.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: historyParts,
          toolConfig: {
            systemInstruction: "You are a specialized Admin Assistant for 'Beauty Attraction Parlor'. You can manage services and packages using the provided tools. Always be polite, professional, and concise. When listing items, use a clean format. When an action is successful, confirm it clearly. If you delete something, mention exactly what was deleted.",
            tools: tools
          }
        })
      });

      const data = await response.json();
      
      let responseContent = data.candidates[0].content;
      let finalContent = "";
      
      // Handle potentially multiple rounds of tool calls
      while (responseContent.parts?.some((p: any) => p.functionCall)) {
        const toolResponses = [];
        const functionCalls = responseContent.parts.filter((p: any) => p.functionCall).map((p: any) => p.functionCall);
        
        for (const call of functionCalls) {
          const result = await handleToolCall(call);
          toolResponses.push({
            functionResponse: {
              name: call.name,
              response: result,
              id: call.id
            }
          });
        }

        // Send results back to model (via proxy again - need to refactor proxy to handle this or send entire history)
        const nextResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [...historyParts, responseContent, { parts: toolResponses }],
              toolConfig: {
                systemInstruction: "You are a specialized Admin Assistant for 'Beauty Attraction Parlor'.",
                tools: tools
              }
            })
          });
          const nextData = await nextResponse.json();
          responseContent = nextData.candidates[0].content;
      }

      finalContent = responseContent.parts?.[0]?.text || "I've processed your request.";
      setMessages(prev => [...prev, { role: 'assistant', content: finalContent }]);

    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error processing your request. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-white border border-brand-black/10 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-brand-black p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand-black" />
          </div>
          <div>
            <h3 className="text-brand-ivory font-serif text-lg leading-tight">Salon AI Assistant</h3>
            <p className="text-[10px] text-brand-gold uppercase tracking-widest font-medium">Smart Dashboard Management</p>
          </div>
        </div>
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[10px] text-brand-ivory/40 uppercase tracking-widest">Active</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-brand-gold/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${m.role === 'user' ? 'bg-brand-black/5' : 'bg-brand-gold/10'}`}>
                {m.role === 'user' ? <User className="w-4 h-4 text-brand-black/40" /> : <Bot className="w-4 h-4 text-brand-gold" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-brand-black text-brand-ivory rounded-tr-none' 
                  : 'bg-brand-ivory/50 border border-brand-black/5 text-brand-black rounded-tl-none font-light'
              }`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[85%] flex gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center mt-1">
                <Bot className="w-4 h-4 text-brand-gold" />
              </div>
              <div className="p-4 bg-brand-ivory/50 border border-brand-black/5 text-brand-black rounded-2xl rounded-tl-none">
                <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-brand-black/5 bg-brand-ivory/10">
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Type your command (e.g. 'Add a new facial package')..."
            className="w-full bg-white border border-brand-black/10 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all text-sm font-light placeholder:text-brand-black/30"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              !input.trim() || isTyping 
                ? 'bg-brand-black/5 text-brand-black/20' 
                : 'bg-brand-black text-brand-gold hover:scale-105 active:scale-95 shadow-lg'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-center mt-3 text-brand-black/30 uppercase tracking-[0.2em] font-medium">Beauty Attraction AI • Ver 1.0</p>
      </div>
    </div>
  );
}
