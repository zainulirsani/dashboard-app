import React, { useState } from 'react';
import { Calendar, Badge, List, HStack } from 'rsuite';
import 'rsuite/Calendar/styles/index.css';
import 'rsuite/Badge/styles/index.css';
import 'rsuite/List/styles/index.css';


type Agenda = {
  tanggal_awal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  acara: string;
  nama_pengguna: string;
};

type Penugasan = {
  agenda: Agenda[];
};

type Surat = {
  penugasan: Penugasan[];
};

type Props = {
  suratData: Surat[];
};

export const CalendarAgenda = ({ suratData }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Ambil semua agenda dari data surat
  const allAgendas: Agenda[] = suratData.flatMap(surat =>
    surat.penugasan.flatMap(p =>
      p.agenda.map(ag => ({
        tanggal_awal: ag.tanggal_awal,
        waktu_mulai: ag.waktu_mulai,
        waktu_selesai: ag.waktu_selesai,
        acara: ag.acara,
        nama_pengguna: ag.nama_pengguna
      }))
    )
  );

  const getAgendaByDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return allAgendas.filter(item => item.tanggal_awal === dateStr);
  };

  const renderCell = (date: Date) => {
    const list = getAgendaByDate(date);
    if (list.length) {
      return <Badge className="calendar-todo-item-badge" />;
    }
    return null;
  };

  const AgendaList = ({ date }: { date: Date | null }) => {
    if (!date) return null;
    const agendaList = getAgendaByDate(date);
    if (!agendaList.length) {
      return <div className="no-agenda-message">Tidak ada agenda pada tanggal ini.</div>;
    }

    return (
      <List className="agenda-list" bordered>
        {agendaList.map((item, idx) => (
          <List.Item key={idx} index={idx} className="agenda-list-item">
            <div className="agenda-item-title"><strong>{item.acara}</strong></div>
            <div className="agenda-item-subtitle">{item.nama_pengguna}</div>
            <div className="agenda-item-time">{item.waktu_mulai} - {item.waktu_selesai}</div>
          </List.Item>
        ))}
      </List>
    );
  };

  return (
    <HStack spacing={10} className="calendar-agenda-container">
      <Calendar
        compact
        renderCell={renderCell}
        onSelect={(date) => setSelectedDate(date)}
        className="calendar-component"
      />
      <AgendaList date={selectedDate} />
    </HStack>
  );
};
