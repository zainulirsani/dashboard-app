import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import type { EventInput, EventMountArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import idLocale from "@fullcalendar/core/locales/id";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

type SuratType = {
  jenis_surat: string;
  tanggal_awal: string;
  tanggal_akhir: string;
  perihal?: string;
  keterangan?: string;
  sifat_surat?: string;
};

type CalendarProps = {
  data: SuratType[];
};

type EventExtendedProps = {
  perihal: string;
  keterangan: string;
};

const CustomCalendar: React.FC<CalendarProps> = ({ data }) => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const evts: EventInput[] = data.map((item) => ({
      title: item.jenis_surat,
      start: item.tanggal_awal,
      end: item.tanggal_akhir,
      extendedProps: {
        perihal: item.perihal ?? "-",
        keterangan: item.keterangan ?? "-",
      },
      color: "#800020", // warna merah elegan
    }));
    setEvents(evts);
  }, [data]);

  return (
    <div className="bg-white shadow-lg p-3 rounded-xl">
      <style jsx global>{`
        .fc .fc-toolbar-title {
          font-size: 1.5rem !important;
        }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={
          isMobile
            ? { left: "prev,next", center: "title", right: "" }
            : { left: "prev,next today", center: "title", right: "dayGridMonth,dayGridWeek,dayGridDay" }
        }
        events={events}
        locale={idLocale}
        timeZone="Asia/Makassar"
        eventDidMount={(info: EventMountArg) => {
          const { perihal, keterangan } = info.event.extendedProps as EventExtendedProps;
          tippy(info.el, {
            allowHTML: true,
            content: `
              <div>
                <strong>Perihal:</strong> ${perihal}<br/>
                <strong>Keterangan:</strong> ${keterangan}
              </div>
            `,
          });
        }}
        height="auto"
      />
    </div>
  );
};

export default CustomCalendar;
