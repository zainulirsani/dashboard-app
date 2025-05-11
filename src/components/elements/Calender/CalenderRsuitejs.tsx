import React, { useState } from 'react';
import { Calendar, Badge, List, Stack } from 'rsuite';
import 'rsuite/Calendar/styles/index.css';
import 'rsuite/Badge/styles/index.css';
import 'rsuite/List/styles/index.css';
import '@/styles/Calender.css';

type Agenda = {
  tanggal_awal: string;
  jenis_surat: string;
  waktu_mulai: string;
  waktu_selesai: string;
  acara: string;
  nama_pengguna: string;
  keterangan: string;
};

type Penugasan = {
  agenda: Agenda[];
};

type Surat = {
  penugasan: Penugasan[];
  perihal: string;
  tanggal_awal: string;
  jenis_surat: string;
  keterangan: string;
};

type Props = {
  suratData: Surat[];
};

export const CalendarAgenda = ({ suratData }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const allAgendas: Agenda[] = suratData.flatMap(surat => {
    if (!surat.penugasan || surat.penugasan.length === 0) {
      return [{
        tanggal_awal: surat.tanggal_awal,
        jenis_surat: surat.jenis_surat,
        keterangan: surat.keterangan,
        waktu_mulai: '',
        waktu_selesai: '',
        acara: surat.perihal,
        nama_pengguna: '-', 
      }];
    }

    const hasil = surat.penugasan.flatMap(p => {
      if (!p.agenda || p.agenda.length === 0) {
        return [{
          tanggal_awal: surat.tanggal_awal,
          jenis_surat: surat.jenis_surat,
          keterangan: surat.keterangan,
          waktu_mulai: '',
          waktu_selesai: '',
          acara: surat.perihal,
          nama_pengguna: '-', 
        }];
      }

      return p.agenda.map(ag => ({
        tanggal_awal: ag.tanggal_awal,
        jenis_surat: surat.jenis_surat,
        keterangan: surat.keterangan,
        waktu_mulai: ag.waktu_mulai,
        waktu_selesai: ag.waktu_selesai,
        acara: ag.acara,
        nama_pengguna: ag.nama_pengguna,
      }));
    });

    return hasil.length > 0 ? hasil : [{
      tanggal_awal: surat.tanggal_awal,
      jenis_surat: surat.jenis_surat,
      keterangan: surat.keterangan,
      waktu_mulai: '',
      waktu_selesai: '',
      acara: surat.perihal,
      nama_pengguna: '-', // fallback lagi kalau semua kosong
    }];
  });

  const getAgendaByDate = (date: Date) => {
    const dateStr = date.toLocaleDateString('sv-SE'); // '2024-06-28'
    return allAgendas.filter(item => item.tanggal_awal === dateStr);
  };


  const renderCell = (date: Date) => {
    const list = getAgendaByDate(date);
    if (list.length) {
      return <Badge content="•" color="green" className="calendar-todo-item-badge" />;
    }
    return null;
  };

  const AgendaList = ({ date }: { date: Date | null }) => {
    if (!date) return (
      <div className="agenda-placeholder">Pilih tanggal untuk melihat agenda.</div>
    );

    const agendaList = getAgendaByDate(date);
    if (!agendaList.length) {
      return <div className="no-agenda-message">🎉 Tidak ada agenda pada tanggal ini.</div>;
    }

    return (
      <div className="agenda-list-wrapper">
        <h4 className="agenda-date-title">
          Agenda tanggal {date.toLocaleDateString()}
        </h4>
        <List bordered hover className="agenda-list">
          {agendaList.map((item, idx) => (
            <List.Item key={idx} index={idx} className="agenda-list-item">
              <div className="agenda-item-title">{item.acara}</div>
              <div>Jenis Surat :{item.jenis_surat}</div>
              <div className="agenda-item-subtitle">👤 {item.nama_pengguna}</div>
              <div className="agenda-item-time">🕒 {item.waktu_mulai} - {item.waktu_selesai}</div>
              <div
                className="agenda-item-description"
                dangerouslySetInnerHTML={{ __html: item.keterangan }}
              ></div>
            </List.Item>
          ))}
        </List>
      </div>
    );
  };

  return (
    <div className="calendar-agenda-responsive">
      <Stack
        direction="row"
        wrap
        spacing={20}
        className="calendar-agenda-stack"
      >
        <div className="calendar-wrapper" style={{ flex: selectedDate ? 1 : '100%' }}>
          <Calendar
            compact
            bordered
            renderCell={renderCell}
            onSelect={(date) => setSelectedDate(date)}
            className="calendar-component modern-calendar"
          />
        </div>

        {selectedDate && (
          <AgendaList date={selectedDate} />
        )}
      </Stack>
    </div>
  );

};
