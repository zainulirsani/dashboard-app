import React, { useState } from 'react';
import { Calendar, Badge, Stack } from 'rsuite';
import 'rsuite/Calendar/styles/index.css';
import 'rsuite/Badge/styles/index.css';
import 'rsuite/List/styles/index.css';
import '@/styles/Calender.module.css';

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
      <div className="container py-4">
        <h4 className="mb-4 fw-bold text-primary">
          Agenda tanggal {date.toLocaleDateString()}
        </h4>
        <div className="list-group">
          {agendaList.map((item, idx) => (
            <div key={idx} className="list-group-item list-group-item-action shadow-sm mb-3 rounded">
              <div className="mb-2">
                <h5 className="mb-1 fw-semibold">{item.acara}</h5>
                <small className="text-muted d-block">
                  🕒 {item.waktu_mulai} - {item.waktu_selesai}
                </small>
              </div>

              <p className="mb-1 text-secondary">
                Jenis Surat: <span className="fw-medium">{item.jenis_surat}</span>
              </p>
              <small className="text-muted d-block mb-2">👤 {item.nama_pengguna}</small>
              <div
                className="text-dark agenda-keterangan"
                dangerouslySetInnerHTML={{ __html: item.keterangan }}
              />
            </div>
          ))}
        </div>
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
