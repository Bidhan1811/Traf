"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Select } from '@/components/ui/select';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import { IndianRupeeIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const DATE_RANGES = {
    "7D": {label: "Last 7 Days", days: 7 },
    "1M": {label: "Last Month", days: 30 },
    "3M": {label: "Last 3 Months", days: 90 },
    "6M": {label: "Last 6 Months", days: 100 },
    ALL: {label: "All Time", days: null },
};
const AccountChart = ({transactions}) => {
    const [dateRange, setDateRange] = useState("1M");
    
    const filteredData = useMemo (()=> {
        const range = DATE_RANGES[dateRange];
        const now = new Date();
        const startDate = range.days
        ? startOfDay(subDays(now, range.days))
        : startOfDay(new Date(0));
        
    const filtered = transactions.filter(
        (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc,transaction) => {
        const date = format(new Date(transaction.date), "MMM dd");

        if(!acc[date]) {
          acc[date] = {date, income: 0, expense: 0}
        }

        if(transaction.type === "INCOME") {
          acc[date].income += transaction.amount;
        } else {
          acc[date].expense += transaction.amount;
        }

        return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    },[transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc,day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0}
    );
      },[filteredData])

     
  return (
    <div className='w-full pt-5'>
      <Card className="ml-3 mr-3"> 
  <CardHeader className="flex-row items-center space-y-0 pb-7 justify-between">
    <CardTitle className="text-base font-normal">Transaction Overview</CardTitle>
    <Select defaultValue={dateRange} onValueChange={setDateRange}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select Range" />
  </SelectTrigger>
  <SelectContent>
  {Object.entries(DATE_RANGES).map(([key, {label}])=>{
    return <SelectItem key={key} value={key}>{label}</SelectItem>
  })}  
</SelectContent>
</Select>
  </CardHeader>
  <CardContent>
    <div className='flex flex-row justify-around mb-6 text-sm'>
      <div className='text-center'>
        <p className='text-muted-foreground'>Total Income</p>
        <p className='text-lg font-bold text-green-500'><IndianRupeeIcon size={15} className='inline-flex'/>{totals.income.toFixed(2)}</p>
      </div>
      <div className='text-center'>
        <p className='text-muted-foreground'>Total Expense</p>
        <p className='text-lg font-bold text-red-500'><IndianRupeeIcon size={15} className='inline-flex'/>{totals.expense.toFixed(2)}</p>
      </div>
      <div className='text-center'>
        <p className='text-muted-foreground'>Net</p>
        <p className={`text-lg font-bold text-${totals.income>totals.expense ? "green" : "red"}-500`}><IndianRupeeIcon size={15} className='inline-flex'/>{totals.income.toFixed(2)-totals.expense.toFixed(2)}</p>
      </div>
    </div>
    <div className='h-[300px]'>
  <ResponsiveContainer width="100%" height="100%">
        <BarChart
         data={filteredData}
          margin={{
            top: 10,
            right: 100,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="date" />
          <YAxis 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `INR ${value}`} />
          <Tooltip formatter={(value) => [`INR ${value}`, undefined]}/>
          <Legend />
          <Bar dataKey="income" name="Income" fill="#008000"  radius={[4,4,0,0]}/>
          <Bar dataKey="expense" name="Expense"fill="#FF0000" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
      </div>
  </CardContent>
</Card>
     
      </div>
  )
}

export default AccountChart
