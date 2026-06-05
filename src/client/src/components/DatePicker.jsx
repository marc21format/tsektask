import React, { useState } from 'react';
import '../styles/datepicker.css';

function DatePicker({ selectedDate, onDateSelect, tasks = [] }) {
  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()));

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  const getTaskCountForDate = (date) => {
    if (!tasks) return 0;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    return tasks.filter(task => {
      if (!task || !task.dueDate) return false;
      if (typeof task.dueDate === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)) {
          return task.dueDate === dateStr;
        }
        const t = new Date(task.dueDate);
        const ty = t.getFullYear();
        const tm = String(t.getMonth() + 1).padStart(2, '0');
        const td = String(t.getDate()).padStart(2, '0');
        return `${ty}-${tm}-${td}` === dateStr;
      }
      const t = new Date(task.dueDate);
      const ty = t.getFullYear();
      const tm = String(t.getMonth() + 1).padStart(2, '0');
      const td = String(t.getDate()).padStart(2, '0');
      return `${ty}-${tm}-${td}` === dateStr;
    }).length;
  };

  const handlePrevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };

  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    days.push(date);
  }

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleDayClick = (date) => {
    onDateSelect(new Date(date));
  };

  const getDateLabel = () => {
    if (!selectedDate) {
      return { dateStr: 'Today', labelText: 'TODAY' };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    
    const diffTime = selected - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const dayName = fullDayNames[selectedDate.getDay()];
    const monthName = monthNames[selectedDate.getMonth()];
    const dateNum = selectedDate.getDate();
    const dateStr = `${dayName}, ${monthName} ${dateNum}`;
    
    let labelText = '';
    if (diffDays === 0) {
      labelText = 'TODAY';
    } else if (diffDays === 1) {
      labelText = 'TOMORROW';
    } else if (diffDays === -1) {
      labelText = 'YESTERDAY';
    } else if (diffDays > 1) {
      labelText = `${diffDays} DAYS FROM NOW`;
    } else {
      labelText = `${Math.abs(diffDays)} DAYS AGO`;
    }
    
    return { dateStr, labelText };
  };

  const { dateStr, labelText } = getDateLabel();

  return (
    <div className="date-picker">
      <h1>{dateStr}</h1>
      <div className="date-label">{labelText}</div>
      
      <div className="week-navigation">
        <button className="nav-btn prev-btn" onClick={handlePrevWeek}>&lt;</button>
        <div className="week-grid">
          {days.map((date, idx) => {
            const isSelected = 
              selectedDate && 
              date.toDateString() === selectedDate.toDateString();
            const taskCount = getTaskCountForDate(date);
            return (
              <div key={idx} className="day-btn-wrapper">
                <div className="day-task-count">{taskCount}</div>
                <button
                  className={`day-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => handleDayClick(date)}
                >
                  <div className="day-name">{dayNames[date.getDay()]}</div>
                  <div className="day-num">{date.getDate()}</div>
                </button>
              </div>
            );
          })}
        </div>
        <button className="nav-btn next-btn" onClick={handleNextWeek}>&gt;</button>
      </div>
    </div>
  );
}

export default DatePicker;
