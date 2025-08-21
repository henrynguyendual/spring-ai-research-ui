"use client"

import * as React from "react"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { format, isValid } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
  clearable?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  formatStr?: string
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  clearable = true,
  minDate,
  maxDate,
  disabledDates,
  formatStr = "PPP",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      onDateChange?.(selectedDate)
      setOpen(false)
    },
    [onDateChange]
  )

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDateChange?.(undefined)
    },
    [onDateChange]
  )

  const isDateDisabled = React.useCallback(
    (dateToCheck: Date) => {
      if (minDate && dateToCheck < minDate) return true
      if (maxDate && dateToCheck > maxDate) return true
      if (disabledDates?.some(disabledDate => 
        dateToCheck.toDateString() === disabledDate.toDateString()
      )) return true
      return false
    },
    [minDate, maxDate, disabledDates]
  )

  const displayText = React.useMemo(() => {
    if (!date || !isValid(date)) return placeholder
    return format(date, formatStr)
  }, [date, placeholder, formatStr])

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
            {clearable && date && (
              <X
                className="ml-auto h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn("w-auto p-0", contentClassName)} 
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export interface DateRangePickerProps {
  dateRange?: { from: Date | undefined; to?: Date | undefined }
  onDateRangeChange?: (range: { from: Date | undefined; to?: Date | undefined } | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
  clearable?: boolean
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  formatStr?: string
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = "Pick a date range",
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  clearable = true,
  minDate,
  maxDate,
  disabledDates,
  formatStr = "LLL dd, y",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = React.useCallback(
    (range: { from: Date | undefined; to?: Date | undefined } | undefined) => {
      onDateRangeChange?.(range)
      if (range?.from && range?.to) {
        setOpen(false)
      }
    },
    [onDateRangeChange]
  )

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDateRangeChange?.(undefined)
    },
    [onDateRangeChange]
  )

  const isDateDisabled = React.useCallback(
    (dateToCheck: Date) => {
      if (minDate && dateToCheck < minDate) return true
      if (maxDate && dateToCheck > maxDate) return true
      if (disabledDates?.some(disabledDate => 
        dateToCheck.toDateString() === disabledDate.toDateString()
      )) return true
      return false
    },
    [minDate, maxDate, disabledDates]
  )

  const displayText = React.useMemo(() => {
    if (!dateRange?.from) {
      return placeholder
    }

    if (dateRange.to) {
      return `${format(dateRange.from, formatStr)} - ${format(dateRange.to, formatStr)}`
    }

    return format(dateRange.from, formatStr)
  }, [dateRange, placeholder, formatStr])

  const hasSelection = dateRange?.from || dateRange?.to

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !hasSelection && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
            {clearable && hasSelection && (
              <X
                className="ml-auto h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn("w-auto p-0", contentClassName)} 
          align="start"
        >
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            disabled={isDateDisabled}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export interface DateTimePickerProps extends Omit<DatePickerProps, "onDateChange"> {
  onDateTimeChange?: (date: Date | undefined) => void
  showTime?: boolean
}

export function DateTimePicker({
  date,
  onDateTimeChange,
  placeholder = "Pick a date and time",
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  clearable = true,
  minDate,
  maxDate,
  disabledDates,
  formatStr = "PPP p",
  showTime = true,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [timeValue, setTimeValue] = React.useState(() => {
    if (date && isValid(date)) {
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")
      return `${hours}:${minutes}`
    }
    return "00:00"
  })

  const handleDateSelect = React.useCallback(
    (selectedDate: Date | undefined) => {
      if (!selectedDate) {
        onDateTimeChange?.(undefined)
        return
      }

      if (!showTime) {
        onDateTimeChange?.(selectedDate)
        setOpen(false)
        return
      }

      const [hours, minutes] = timeValue.split(":").map(Number)
      const newDateTime = new Date(selectedDate)
      newDateTime.setHours(hours, minutes)
      onDateTimeChange?.(newDateTime)
    },
    [onDateTimeChange, timeValue, showTime]
  )

  const handleTimeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTimeValue = e.target.value
      setTimeValue(newTimeValue)

      if (date && isValid(date)) {
        const [hours, minutes] = newTimeValue.split(":").map(Number)
        const newDateTime = new Date(date)
        newDateTime.setHours(hours, minutes)
        onDateTimeChange?.(newDateTime)
      }
    },
    [date, onDateTimeChange]
  )

  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDateTimeChange?.(undefined)
      setTimeValue("00:00")
    },
    [onDateTimeChange]
  )

  const isDateDisabled = React.useCallback(
    (dateToCheck: Date) => {
      if (minDate && dateToCheck < minDate) return true
      if (maxDate && dateToCheck > maxDate) return true
      if (disabledDates?.some(disabledDate => 
        dateToCheck.toDateString() === disabledDate.toDateString()
      )) return true
      return false
    },
    [minDate, maxDate, disabledDates]
  )

  const displayText = React.useMemo(() => {
    if (!date || !isValid(date)) return placeholder
    return format(date, formatStr)
  }, [date, placeholder, formatStr])

  React.useEffect(() => {
    if (date && isValid(date)) {
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")
      setTimeValue(`${hours}:${minutes}`)
    }
  }, [date])

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
            {clearable && date && (
              <X
                className="ml-auto h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn("w-auto p-0", contentClassName)} 
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            initialFocus
          />
          {showTime && (
            <div className="border-t p-3">
              <div className="flex items-center gap-2">
                <label htmlFor="time-picker" className="text-sm font-medium">
                  Time:
                </label>
                <input
                  id="time-picker"
                  type="time"
                  value={timeValue}
                  onChange={handleTimeChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}