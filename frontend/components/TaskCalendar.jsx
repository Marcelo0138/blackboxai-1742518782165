import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/router';

const TaskCalendar = ({ tasks }) => {
  const router = useRouter();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Convert tasks to calendar events
    const calendarEvents = tasks.map(task => ({
      id: task._id,
      title: task.title,
      start: task.deadline,
      end: task.deadline,
      allDay: true,
      backgroundColor: getStatusColor(task.status),
      borderColor: getStatusColor(task.status),
      extendedProps: {
        status: task.status,
        priority: task.priority,
        description: task.description
      }
    }));

    setEvents(calendarEvents);
  }, [tasks]);

  const getStatusColor = (status) => {
    const colors = {
      'Pendente': '#FFA500',
      'Em Andamento': '#3B82F6',
      'Em Revisão': '#8B5CF6',
      'Concluída': '#10B981',
      'default': '#6B7280'
    };
    return colors[status] || colors.default;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Baixa': 'bg-green-400',
      'Média': 'bg-yellow-400',
      'Alta': 'bg-red-400',
      'Urgente': 'bg-red-600',
      'default': 'bg-gray-400'
    };
    return colors[priority] || colors.default;
  };

  const handleEventClick = (clickInfo) => {
    router.push(`/tasks/${clickInfo.event.id}`);
  };

  const handleDateClick = (arg) => {
    router.push(`/tasks/new?date=${arg.dateStr}`);
  };

  const renderEventContent = (eventInfo) => {
    const { priority } = eventInfo.event.extendedProps;
    
    return (
      <div className="flex items-center p-1">
        <span className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(priority)}`} />
        <div className="flex flex-col">
          <span className="text-xs font-medium truncate">{eventInfo.event.title}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {eventInfo.event.extendedProps.status}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="task-calendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventContent={renderEventContent}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana'
        }}
        locale="pt-br"
        height="auto"
        firstDay={0}
        weekends={true}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        allDayText="Dia todo"
        moreLinkText="mais"
        noEventsText="Nenhuma tarefa"
      />

      <style jsx global>{`
        .task-calendar {
          background: var(--fc-page-bg-color, #fff);
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .dark .task-calendar {
          --fc-page-bg-color: #1F2937;
          --fc-border-color: #374151;
          --fc-neutral-bg-color: #111827;
          --fc-list-event-hover-bg-color: #374151;
          --fc-today-bg-color: rgba(59, 130, 246, 0.1);
          --fc-event-bg-color: #3B82F6;
          --fc-event-border-color: #3B82F6;
          --fc-event-text-color: #fff;
          --fc-neutral-text-color: #D1D5DB;
        }

        .fc .fc-button {
          background-color: #3B82F6;
          border-color: #3B82F6;
        }

        .fc .fc-button:hover {
          background-color: #2563EB;
          border-color: #2563EB;
        }

        .fc .fc-button-primary:not(:disabled).fc-button-active,
        .fc .fc-button-primary:not(:disabled):active {
          background-color: #1D4ED8;
          border-color: #1D4ED8;
        }

        .dark .fc-theme-standard td,
        .dark .fc-theme-standard th,
        .dark .fc-theme-standard .fc-scrollgrid {
          border-color: var(--fc-border-color);
        }

        .fc .fc-daygrid-day.fc-day-today {
          background-color: var(--fc-today-bg-color);
        }

        .fc .fc-col-header-cell-cushion,
        .fc .fc-daygrid-day-number {
          color: var(--fc-neutral-text-color);
        }
      `}</style>
    </div>
  );
};

export default TaskCalendar;