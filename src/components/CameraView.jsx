
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

const CameraView = ({ title, imageUrl = "https://via.placeholder.com/800x450?text=Camera+Feed" }) => {
  const [loading, setLoading] = useState(false);
  
  const handleControl = (direction) => {
    setLoading(true);
    console.log(`Camera control: ${direction}`);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <div className="relative bg-gray-900">
        <img 
          src={imageUrl} 
          alt="Camera Feed" 
          className="w-full object-cover aspect-video"
        />
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <RefreshCw size={40} className="text-white animate-spin" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-center mb-4">
          <button 
            onClick={() => handleControl('up')}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronUp size={24} />
          </button>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => handleControl('left')}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => handleControl('down')}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronDown size={24} />
          </button>
          
          <button 
            onClick={() => handleControl('right')}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <div className="flex justify-center mt-4 space-x-4">
          <button 
            onClick={() => handleControl('zoomIn')}
            className="px-4 py-2 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
          >
            <ZoomIn size={18} className="mr-1" />
            <span>Zoom In</span>
          </button>
          
          <button 
            onClick={() => handleControl('zoomOut')}
            className="px-4 py-2 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
          >
            <ZoomOut size={18} className="mr-1" />
            <span>Zoom Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraView;
