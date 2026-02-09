import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Image as ImageIcon } from 'lucide-react';

export default function PortalProjectCard({ project, onClick }) {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border-gray-200"
      onClick={() => onClick?.(project)}
    >
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {project.mainImage ? (
          <img 
            src={project.mainImage} 
            alt={`${project.title} - ${project.category} construction project`}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-300">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-xs font-medium">
            {project.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 leading-tight">{project.title}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {project.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {project.location}
            </span>
          )}
          {project.timeline && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {project.timeline}
            </span>
          )}
          {project.budget && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> {project.budget}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}