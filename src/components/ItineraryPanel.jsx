import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  MoreHorizontal, Share2, Printer, FileText,
  Users, ChevronRight, Eye, Image as ImageIcon,
  Home, Trash2, GripVertical, Navigation
} from 'lucide-react';
import './ItineraryPanel.css';

// ─── Sortable stop card ───────────────────────────────────────────────────────
const SortableStop = ({ stop, index, total, nextStop, activeMenuId, toggleMenu, handleRemoveStop, onFindStops }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? 'transform 250ms cubic-bezier(0.2, 0, 0, 1)',
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="stop-row-wrapper">
      <div className="itinerary-stop-container">
        
        <div className="stop-left-track">
          {index < total - 1 && <div className="stop-connector-line" />}
          <div className="stop-number-circle">{index + 1}</div>
        </div>

        <div className="stop-main-card">
          <div className="stop-card-inner">
            <div className="drag-handle" {...attributes} {...listeners}>
              <GripVertical size={16} color="#9ca3af" />
            </div>
            <div className="stop-thumbnail">
              {stop.type === 'city' ? <Home size={20} /> : <ImageIcon size={20} />}
              <img src={stop.img} alt={stop.name} />
            </div>
            <div className="stop-details">
              <h4>{stop.name}</h4>
            </div>
            <div className="stop-actions-right">
              <div className="more-menu-container">
                <button
                  className={`action-icon-btn ${activeMenuId === stop.id ? 'active' : ''}`}
                  onClick={(e) => toggleMenu(e, stop.id)}
                >
                  <MoreHorizontal size={20} />
                </button>
                {activeMenuId === stop.id && (
                  <div className="stop-action-dropdown">
                    <button className="dropdown-item delete" onClick={() => handleRemoveStop(stop.id)}>
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                )}
              </div>
              <button className="action-icon-btn">
                <Eye size={18} color="#9ca3af" />
              </button>
            </div>
          </div>

          {/* footer */}
          {index < total - 1 && (
            <div className="stop-footer">
              <div className="find-stops-link" onClick={onFindStops}>
                <ChevronRight size={14} /> Find stops here
              </div>
              {nextStop?.distance && (
                <div className="distance-label">
                  {nextStop.distance} • {nextStop.time}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── Ghost card shown inside DragOverlay ─────────────────────────────────────
const DragGhostCard = ({ stop }) => (
  <div
    className="itinerary-stop-container"
    style={{
      opacity: 0.9,
      boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
      borderRadius: 12,
      background: 'white',
      transform: 'scale(1.02)',
      cursor: 'grabbing',
    }}
  >
    <div className="stop-left-track">
      <div className="stop-number-circle">·</div>
    </div>
    <div className="stop-main-card">
      <div className="stop-card-inner">
        <div className="drag-handle">
          <GripVertical size={16} color="#0252cc" />
        </div>
        <div className="stop-thumbnail">
          {stop.type === 'city' ? <Home size={20} /> : <ImageIcon size={20} />}
          <img src={stop.img} alt={stop.name} />
        </div>
        <div className="stop-details">
          <h4>{stop.name}</h4>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main panel ──────────────────────────────────────────────────────────────
const ItineraryPanel = ({ onClose, onFindStops, stops = [], onUpdateStops, onRecalculate }) => {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleRemoveStop = (id) => {
    if (onUpdateStops) {
      onUpdateStops(prev => prev.filter(stop => stop.id !== id));
    }
    setActiveMenuId(null);
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
    setActiveMenuId(null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = stops.findIndex(s => s.id === active.id);
    const newIndex = stops.findIndex(s => s.id === over.id);

    const reordered = arrayMove(stops, oldIndex, newIndex);
    if (onUpdateStops) onUpdateStops(reordered);
    if (onRecalculate) onRecalculate(reordered);
  };

  useEffect(() => {
    const handleClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="itinerary-panel">
      <div className="itinerary-header">
        <div className="header-actions-top">
          <button className="close-trip-btn" onClick={onClose}>Close trip</button>
          <button className="invite-btn"><Users size={16} /> Invite</button>
        </div>
        <div
          className="header-image-bg"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop")' }}
        />
      </div>

      <div className="itinerary-body">
        <div className="itinerary-title-card">
          <h1>Kazakhstan Grand Tour</h1>
          <div className="title-action-icons">
            <Share2 size={20} />
            <Printer size={20} />
            <FileText size={20} />
          </div>
        </div>

        <div className="itinerary-options-grid">
          <button className="opt-btn">Trip settings</button>
          <button className="opt-btn">Routing options</button>
          <button className="opt-btn">Measure tool</button>
          <button className="opt-btn">Add dates</button>
        </div>
        <h2 className="itinerary-title">Itinerary</h2>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={stops.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="itinerary-list custom-scroll">
              {stops.map((stop, i) => (
                <SortableStop
                  key={stop.id}
                  stop={stop}
                  index={i}
                  total={stops.length}
                  nextStop={stops[i + 1]}
                  activeMenuId={activeMenuId}
                  toggleMenu={toggleMenu}
                  handleRemoveStop={handleRemoveStop}
                  onFindStops={onFindStops}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{
            duration: 250,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}>
            {activeId && stops.find(s => s.id === activeId)
              ? <DragGhostCard stop={stops.find(s => s.id === activeId)} />
              : null
            }
          </DragOverlay>
        </DndContext>
        
        <div className="itinerary-bottom-actions">
          <button 
            className="btn-go-trip"
            onClick={() => window.open('https://2gis.kz', '_blank')}
          >
            <Navigation size={18} />
            Go Trip with 2GIS
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPanel;
