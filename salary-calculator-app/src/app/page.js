'use client'

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export default function Home() {
  // Estado para Calculadora de Salário
  const [totalHours, setTotalHours] = useState(220);
  const [totalSalary, setTotalSalary] = useState(1412);
  const [workedHoursInput, setWorkedHoursInput] = useState('');
  const [workedHours, setWorkedHours] = useState(220);

  // Estado para Conversão de Horas
  const [hourInput, setHourInput] = useState('');
  const [decimalHours, setDecimalHours] = useState(null);

  // Estado para Cálculo de Horas Extras
  const [monthlySalary, setMonthlySalary] = useState(1412);
  const [monthlyWorkload, setMonthlyWorkload] = useState(220);
  const [extraHoursInput, setExtraHoursInput] = useState(0);
  const [extraHours, setExtraHours] = useState(0);
  const [extraHourPercentage, setExtraHourPercentage] = useState(50);

  // state for multiple days hours calculation
  const [dayEntries, setDayEntries] = useState([{ id: 1, hours: '8:48' }]);
  const [totalDaysHours, setTotalDaysHours] = useState(null);

  // Função para converter HHH:MM para decimal
  const convertToDecimal = (time) => {
    const timeRegex = /^(\d{1,3}):(\d{2})$/;
    const match = time.match(timeRegex);

    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const decimal = hours + (minutes / 60);
      return parseFloat(decimal.toFixed(2));
    }
    return null;
  };

  // Função auxiliar para converter decimal para HHH:MM
  const convertToHHHMM = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Handler for day hours input
  const handleDayHoursChange = (id, value) => {
    const updatedEntries = dayEntries.map(entry =>
      entry.id === id ? { ...entry, hours: value } : entry
    );
    setDayEntries(updatedEntries);

    // Calculate total hours
    const totalDecimalHours = updatedEntries.reduce((total, entry) => {
      const decimalValue = convertToDecimal(entry.hours);
      return total + (decimalValue !== null ? decimalValue : 0);
    }, 0);

    setTotalDaysHours(totalDecimalHours);
  };

  // Add a new day entry
  const addDayEntry = () => {
    const newId = dayEntries.length > 0
      ? Math.max(...dayEntries.map(entry => entry.id)) + 1
      : 1;

    // Default hours for the new day
    const defaultHours = '8:48';

    // Add the new entry
    const updatedEntries = [...dayEntries, { id: newId, hours: defaultHours }];
    setDayEntries(updatedEntries);

    // Update the total hours
    const totalDecimalHours = updatedEntries.reduce((total, entry) => {
      const decimalValue = convertToDecimal(entry.hours);
      return total + (decimalValue !== null ? decimalValue : 0);
    }, 0);

    setTotalDaysHours(totalDecimalHours);
  };


  // Remove a day entry
  const removeDayEntry = (id) => {
    const updatedEntries = dayEntries.filter(entry => entry.id !== id);
    setDayEntries(updatedEntries);

    // Recalculate total hours
    const totalDecimalHours = updatedEntries.reduce((total, entry) => {
      const decimalValue = convertToDecimal(entry.hours);
      return total + (decimalValue !== null ? decimalValue : 0);
    }, 0);

    setTotalDaysHours(totalDecimalHours);
  };

  // Manipulador de mudança para horas trabalhadas
  const handleWorkedHoursChange = (value) => {
    setWorkedHoursInput(value);
    const decimalValue = convertToDecimal(value);
    if (decimalValue !== null) {
      setWorkedHours(decimalValue);
    } else {
      // Se a conversão falhar, tenta usar o valor como número decimal
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setWorkedHours(numValue);
      }
    }
  };

  // Manipulador de mudança para horas extras
  const handleExtraHoursChange = (value) => {
    setExtraHoursInput(value);
    const decimalValue = convertToDecimal(value);
    if (decimalValue !== null) {
      setExtraHours(decimalValue);
    } else {
      // Se a conversão falhar, tenta usar o valor como número decimal
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setExtraHours(numValue);
      }
    }
  };

  // Cálculo do salário proporcional
  const hourValue = totalSalary / totalHours;
  const proportionalSalary = hourValue * workedHours;

  // Função para converter decimal para HHH:MM na conversão de horas manual
  const manualConvertToDecimal = (time) => {
    const decimalValue = convertToDecimal(time);
    if (decimalValue !== null) {
      setDecimalHours(decimalValue);
    } else {
      setDecimalHours(null);
    }
  };

  // Cálculo de Horas Extras
  const calculateExtraHours = () => {
    const normalHourValue = monthlySalary / monthlyWorkload;
    const extraHourValue = normalHourValue * (1 + (extraHourPercentage / 100));
    const totalExtraValue = extraHourValue * extraHours;

    return {
      normalHourValue: normalHourValue.toFixed(2),
      extraHourValue: extraHourValue.toFixed(2),
      totalExtraValue: totalExtraValue.toFixed(2)
    };
  };

  // Função de validação para aceitar apenas números, ponto, vírgula e dois pontos
  const validateNumericInput = (e) => {
    const allowedChars = /[0-9.:,]/;
    if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

  const extraHoursCalculation = calculateExtraHours();

  return (
    <main className="flex flex-col min-h-screen p-4 bg-gray-100">
      <div className="max-w-6xl mx-auto w-full">
        <h3 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight text-center">
          Calculadora de Salário e Horas
        </h3>
        <br></br>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Conversor de Horas */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center">Conversor de Horas para Decimal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Horas no Formato HHH:MM</Label>
                    <Input
                      type="text"
                      value={hourInput}
                      onChange={(e) => {
                        setHourInput(e.target.value);
                        manualConvertToDecimal(e.target.value);
                      }}
                      onKeyPress={validateNumericInput}
                      placeholder="Ex: 145:30 (até 999:59)"
                    />
                  </div>

                  {decimalHours !== null && (
                    <div className="bg-gray-100 p-3 rounded">
                      <p>Horas em Decimal: {decimalHours}</p>
                      <p>Conversão original: {convertToHHHMM(decimalHours)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Calculadora de Salário */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center">Calculadora de Salário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">

                  <div>
                    <Label>Salário Mensal</Label>
                    <Input
                      type="number"
                      value={totalSalary}
                      onChange={(e) => setTotalSalary(parseFloat(e.target.value))}
                      placeholder="R$ 1412,00"
                    />
                  </div>

                  <div>
                    <Label>Jornada Mensal (Horas)</Label>
                    <Input
                      type="number"
                      value={totalHours}
                      onChange={(e) => setTotalHours(parseFloat(e.target.value))}
                      placeholder="Total de horas"
                    />
                  </div>

                  <div>
                    <Label>Horas Trabalhadas (HHH:MM ou decimal)</Label>
                    <Input
                      type="text"
                      value={workedHoursInput}
                      onChange={(e) => handleWorkedHoursChange(e.target.value)}
                      onKeyPress={validateNumericInput}
                      placeholder="Ex: 149:22 ou 149.37"
                    />
                  </div>

                  <div className="bg-gray-100 p-3 rounded">
                    <p>Valor da Hora: R$ {hourValue.toFixed(2)}</p>
                    <p>Salário Proporcional: R$ {proportionalSalary.toFixed(2)}</p>
                    {/* <p>Horas Trabalhadas (decimal): {workedHours}</p> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Central - Cálculo de Horas Extras */}
          <div className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center">Cálculo de Horas Extras</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Salário Mensal</Label>
                    <Input
                      type="number"
                      value={monthlySalary}
                      onChange={(e) => setMonthlySalary(parseFloat(e.target.value))}
                      placeholder="R$ 1412,00"
                    />
                  </div>

                  <div>
                    <Label>Jornada Mensal (Horas)</Label>
                    <Input
                      type="number"
                      value={monthlyWorkload}
                      onChange={(e) => setMonthlyWorkload(parseFloat(e.target.value))}
                      placeholder="Jornada mensal"
                    />
                  </div>

                  <div>
                    <Label>Horas Extras Realizadas (HHH:MM ou decimal)</Label>
                    <Input
                      type="text"
                      value={extraHoursInput}
                      onChange={(e) => handleExtraHoursChange(e.target.value)}
                      onKeyPress={validateNumericInput}
                      placeholder="Ex: 10:30 ou 10.5"
                    />
                  </div>

                  <div>
                    <Label>Porcentagem Hora Extra (%)</Label>
                    <Input
                      type="text"
                      value={extraHourPercentage.toString()}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,]/g, '');
                        setExtraHourPercentage(value === '' ? 0 : parseFloat(value.replace(',', '.')));
                      }}
                      onKeyPress={validateNumericInput}
                      placeholder="Porcentagem hora extra"
                    />
                  </div>

                  <div className="bg-gray-100 p-3 rounded">
                    <p>Valor Hora Normal: R$ {extraHoursCalculation.normalHourValue}</p>
                    <p>Valor Hora Extra ({extraHourPercentage}%): R$ {extraHoursCalculation.extraHourValue}</p>
                    <p>Valor Total Horas Extras: R$ {extraHoursCalculation.totalExtraValue}</p>
                    <p>Salário + Horas Extras: R$ {(parseFloat(monthlySalary) + parseFloat(extraHoursCalculation.totalExtraValue)).toFixed(2)}</p>
                    {/* <p>Horas Extras (decimal): {extraHours}</p> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Esquerda - Cálculo de Horas por Dia */}
          <div>
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center">Calculadora de Horas por Dias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dayEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center space-x-2">
                      <div className="flex-grow">
                        <Label>Dia {entry.id}</Label>
                        <Input
                          type="text"
                          value={entry.hours}
                          onChange={(e) => handleDayHoursChange(entry.id, e.target.value)}
                          onKeyPress={validateNumericInput}
                          placeholder="Ex: 8:30 ou 8.5"
                        />
                      </div>
                      {dayEntries.length > 1 && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeDayEntry(entry.id)}
                          className="mt-6"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-between items-center">
                    <Button onClick={addDayEntry} variant="outline">
                      <Plus className="mr-2 h-4 w-4" /> Adicionar Dia
                    </Button>
                  </div>

                  {totalDaysHours !== null && (
                    <div className="bg-gray-100 p-3 rounded mt-4">
                      <p>Total de Horas: {convertToHHHMM(totalDaysHours)} ({totalDaysHours.toFixed(2)})</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}