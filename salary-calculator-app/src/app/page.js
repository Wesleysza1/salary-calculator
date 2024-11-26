'use client'

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  // Estado para Calculadora de Salário
  const [totalHours, setTotalHours] = useState(220);
  const [totalSalary, setTotalSalary] = useState(2900);
  const [workedHours, setWorkedHours] = useState(149.37);

  // Estado para Conversão de Horas
  const [hourInput, setHourInput] = useState('');
  const [decimalHours, setDecimalHours] = useState(null);

  // Cálculo do salário proporcional
  const hourValue = totalSalary / totalHours;
  const proportionalSalary = hourValue * workedHours;

  // Função para converter HHH:MM para decimal
  const convertToDecimal = (time) => {
    // Validar formato HHH:MM (1 a 3 dígitos de horas)
    const timeRegex = /^(\d{1,3}):(\d{2})$/;
    const match = time.match(timeRegex);

    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);

      // Converter para decimal
      const decimal = hours + (minutes / 60);
      setDecimalHours(parseFloat(decimal.toFixed(2)));
    } else {
      setDecimalHours(null);
    }
  };

  // Função auxiliar para converter decimal para HHH:MM
  const convertToHHHMM = (decimalTime) => {
    const hours = Math.floor(decimalTime);
    const minutes = Math.round((decimalTime - hours) * 60);
    
    // Garantir que minutos sempre tenham 2 dígitos
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${hours}:${formattedMinutes}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100 space-y-6">
      {/* Conversor de Horas */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Conversor de Horas</CardTitle>
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
                  convertToDecimal(e.target.value);
                }}
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Calculadora de Salário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Total de Horas no Período</Label>
              <Input 
                type="number" 
                value={totalHours} 
                onChange={(e) => setTotalHours(parseFloat(e.target.value))}
                placeholder="Total de horas"
              />
            </div>

            <div>
              <Label>Salário Total</Label>
              <Input 
                type="number" 
                value={totalSalary} 
                onChange={(e) => setTotalSalary(parseFloat(e.target.value))}
                placeholder="Salário total"
              />
            </div>

            <div>
              <Label>Horas Trabalhadas</Label>
              <Input 
                type="number" 
                step="0.01"
                value={workedHours} 
                onChange={(e) => setWorkedHours(parseFloat(e.target.value))}
                placeholder="Horas trabalhadas"
              />
            </div>

            <div className="bg-gray-100 p-3 rounded">
              <p>Valor da Hora: R$ {hourValue.toFixed(2)}</p>
              <p>Salário Proporcional: R$ {proportionalSalary.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}