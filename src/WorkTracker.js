import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function WorkTracker() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth()); // Muaji aktual
  const [selectedMonth, setSelectedMonth] = useState(null); // Muaji i selektuar për shfaqje

  // Ngarko të dhënat nga LocalStorage kur hapet aplikacioni
  useEffect(() => {
    const savedEvents = localStorage.getItem("workEvents");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Ruaj të dhënat në LocalStorage kur ndryshojnë
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("workEvents", JSON.stringify(events));
    }
  }, [events]);

  // Funksioni që ekzekutohet kur klikohet mbi datën në kalendar
  const handleDateClick = (info) => {
    const amount = prompt(`Shëno të ardhurat për ${info.dateStr} (€):`);
    if (amount) {
      const newEvent = {
        title: `€${amount}`,
        date: info.dateStr,
        month: new Date(info.dateStr).getMonth(),
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
  };

  // Llogarit totalin e të ardhurave për muajin e zgjedhur
  const calculateTotalForMonth = (monthIndex) => {
    const filteredEvents = events.filter(
      (event) => new Date(event.date).getMonth() === monthIndex
    );
    const monthTotal = filteredEvents.reduce((acc, event) => {
      const amount = parseFloat(event.title.replace("€", ""));
      return acc + amount;
    }, 0);
    setTotal(monthTotal);
  };

  // Llogarit totalin për të gjitha muajt
  const calculateTotalForAllMonths = () => {
    const totalAmount = events.reduce((acc, event) => {
      const amount = parseFloat(event.title.replace("€", ""));
      return acc + amount;
    }, 0);
    setTotal(totalAmount);
  };

  // Fshi totalin e muajit të zgjedhur
  const clearTotalForMonth = () => {
    setTotal(0);
    setSelectedMonth(null);
  };

  return (
    <div className="container">
      {/* Butonat e totalit lart */}
      <div className="buttons">
        {/* Butoni për shfaqjen e totalit për një muaj të caktuar */}
        <button
          onClick={() => {
            calculateTotalForMonth(month);
            setSelectedMonth(month);
          }}
          className="btn btn-blue"
        >
          Shfaq Totalin për Muajin {month + 1}
        </button>
        {/* Butoni për shfaqjen e totalit për të gjitha muajt */}
        <button onClick={calculateTotalForAllMonths} className="btn btn-blue">
          Shfaq Totalin për Të Gjithë Muajt
        </button>
        {/* Butoni për fshirjen e totalit për muajin aktual */}
        {selectedMonth !== null && (
          <button onClick={clearTotalForMonth} className="btn btn-red">
            Fshi Totalin për Muajin {selectedMonth + 1}
          </button>
        )}
        <h2 className="total">
          Total: €{total} {selectedMonth !== null && `(Muaji ${selectedMonth + 1})`}
        </h2>
      </div>

      {/* Kalendarin */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
      />
    </div>
  );
}
