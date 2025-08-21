"use client"

import * as React from "react"
import { Combobox, MultiCombobox, type ComboboxOption } from "./combobox"
import { DatePicker, DateRangePicker, DateTimePicker } from "./date-picker"

const fruits: ComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "strawberry", label: "Strawberry" },
]

export function ComponentDemo() {
  const [selectedFruit, setSelectedFruit] = React.useState<string>("")
  const [selectedFruits, setSelectedFruits] = React.useState<string[]>([])
  const [selectedDate, setSelectedDate] = React.useState<Date>()
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined
    to?: Date | undefined
  }>()
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date>()

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Combobox Components</h2>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Single Selection Combobox</h3>
          <Combobox
            options={fruits}
            value={selectedFruit}
            onValueChange={setSelectedFruit}
            placeholder="Select a fruit..."
          />
          <p className="text-sm text-muted-foreground">
            Selected: {selectedFruit || "None"}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Multi Selection Combobox</h3>
          <MultiCombobox
            options={fruits}
            values={selectedFruits}
            onValuesChange={setSelectedFruits}
            placeholder="Select fruits..."
            maxSelected={3}
          />
          <p className="text-sm text-muted-foreground">
            Selected: {selectedFruits.join(", ") || "None"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Date Picker Components</h2>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Single Date Picker</h3>
          <DatePicker
            date={selectedDate}
            onDateChange={setSelectedDate}
          />
          <p className="text-sm text-muted-foreground">
            Selected: {selectedDate?.toLocaleDateString() || "None"}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Date Range Picker</h3>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <p className="text-sm text-muted-foreground">
            From: {dateRange?.from?.toLocaleDateString() || "None"} | 
            To: {dateRange?.to?.toLocaleDateString() || "None"}
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Date Time Picker</h3>
          <DateTimePicker
            date={selectedDateTime}
            onDateTimeChange={setSelectedDateTime}
            showTime={true}
          />
          <p className="text-sm text-muted-foreground">
            Selected: {selectedDateTime?.toLocaleString() || "None"}
          </p>
        </div>
      </div>
    </div>
  )
}