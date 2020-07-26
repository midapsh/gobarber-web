import React, { useState, useCallback } from 'react';
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

const Dashboard: React.FC = () => {
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
  const [selectedDate, setSelectedDate] = useState<Date>();

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (Boolean(day) && modifiers.available) {
      setSelectedDate(day);
    }
  }, []);

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
              <span>Hoje</span>
              <span>Dia 06</span>
              <span>Segunda-feira</span>
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

              <Appointment>
                <span>
                  <FiClock />
                  11:00
                </span>

                <div>
                  <img src={user.avatar_url} alt={user.name} />

                  <strong>Henrique Spadim</strong>
                </div>
              </Appointment>

              <Appointment>
                <span>
                  <FiClock />
                  11:30
                </span>

                <div>
                  <img src={user.avatar_url} alt={user.name} />

                  <strong>Henrique Spadim</strong>
                </div>
              </Appointment>
            </Section>

            <Section>
              <strong>Tarde</strong>

              <Appointment>
                <span>
                  <FiClock />
                  15:00
                </span>

                <div>
                  <img src={user.avatar_url} alt={user.name} />

                  <strong>Henrique Spadim</strong>
                </div>
              </Appointment>
            </Section>
          </Schedule>
          <Calendar>
            <DayPicker
              weekdaysShort={WEEKDAYSSHORT}
              fromMonth={new Date()}
              disabledDays={[{ daysOfWeek: [0, 6] }]}
              modifiers={{
                available: { daysOfWeek: [1, 2, 3, 4, 5] },
              }}
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
