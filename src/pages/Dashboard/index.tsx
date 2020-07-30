import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { isToday, format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiPower, FiClock } from 'react-icons/fi';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import getNextWorkday from '../../utils/getNextWorkday';
import api from '../../services/api';

interface IMonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface IUser {
  name: string;
  avatar_url: string;
}

interface IAppointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: IUser;
}

const WEEKDAYSSHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(() =>
    getNextWorkday(new Date()),
  );
  const [currentMonth, setCurrentMonth] = useState(() =>
    getNextWorkday(new Date()),
  );

  const [appointments, setAppointments] = useState<IAppointment[]>([]);

  const [monthAvailability, setMonthAvailability] = useState<
    IMonthAvailabilityItem[]
  >([]);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (Boolean(day) && modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => setMonthAvailability(response.data));
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<IAppointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const appointmentsFormatted = response.data.map(appointment => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          };
        });

        setAppointments(appointmentsFormatted);
      });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => !monthDay.available)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const date = new Date(year, month, monthDay.day);
        return date;
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", {
      locale: ptBR,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBR });
  }, [selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  return (
    <>
      <Container>
        <Header>
          <HeaderContent>
            <img src={logoImg} alt="GoBarber" />

            <Profile>
              <img src={user.avatar_url} alt={user.name} />
              <div>
                <span>Bem-vindo</span>
                <strong>{user.name}</strong>
              </div>
            </Profile>

            <button type="button" onClick={signOut}>
              <FiPower />
            </button>
          </HeaderContent>
        </Header>

        <Content>
          <Schedule>
            <h1>Horários agendados</h1>
            <p>
              {isToday(selectedDate) && <span>Hoje</span>}
              <span>{selectedDateAsText}</span>
              <span>{selectedWeekDay}</span>
            </p>

            <NextAppointment>
              <strong>Atendimento a seguir</strong>
              <div>
                <img src={user.avatar_url} alt={user.name} />

                <strong>Henrique Spadim</strong>
                <span>
                  <FiClock />
                  10:00
                </span>
              </div>
            </NextAppointment>

            <Section>
              <strong>Manhã</strong>

              {morningAppointments.map(appointment => {
                return (
                  <Appointment key={appointment.id}>
                    <span>
                      <FiClock />
                      {appointment.hourFormatted}
                    </span>

                    <div>
                      <img
                        src={appointment.user.avatar_url}
                        alt={appointment.user.name}
                      />

                      <strong>{appointment.user.name}</strong>
                    </div>
                  </Appointment>
                );
              })}
            </Section>

            <Section>
              <strong>Tarde</strong>

              {afternoonAppointments.map(appointment => {
                return (
                  <Appointment key={appointment.id}>
                    <span>
                      <FiClock />
                      {appointment.hourFormatted}
                    </span>

                    <div>
                      <img
                        src={appointment.user.avatar_url}
                        alt={appointment.user.name}
                      />

                      <strong>{appointment.user.name}</strong>
                    </div>
                  </Appointment>
                );
              })}
            </Section>
          </Schedule>
          <Calendar>
            <DayPicker
              weekdaysShort={WEEKDAYSSHORT}
              fromMonth={new Date()}
              disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
              modifiers={{
                available: { daysOfWeek: [1, 2, 3, 4, 5] },
              }}
              onMonthChange={handleMonthChange}
              selectedDays={selectedDate}
              onDayClick={handleDateChange}
              months={MONTHS}
            />
          </Calendar>
        </Content>
      </Container>
    </>
  );
};

export default Dashboard;
