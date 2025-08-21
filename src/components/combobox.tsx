"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
  searchable?: boolean
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  emptyText = "No options found.",
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  searchable = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  )

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchValue) return options
    
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue, searchable])

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      if (selectedValue === value) {
        onValueChange?.("")
      } else {
        onValueChange?.(selectedValue)
      }
      setOpen(false)
      setSearchValue("")
    },
    [value, onValueChange]
  )

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchValue("")
    }
  }, [])

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              !selectedOption && "text-muted-foreground",
              triggerClassName
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn("w-[--radix-popover-trigger-width] p-0", contentClassName)}
          align="start"
        >
          <Command>
            {searchable && (
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchValue}
                onValueChange={setSearchValue}
              />
            )}
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={handleSelect}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export interface MultiComboboxProps extends Omit<ComboboxProps, "value" | "onValueChange"> {
  values?: string[]
  onValuesChange?: (values: string[]) => void
  maxSelected?: number
}

export function MultiCombobox({
  options,
  values = [],
  onValuesChange,
  maxSelected,
  placeholder = "Select options...",
  searchPlaceholder = "Search options...",
  emptyText = "No options found.",
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  searchable = true,
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const selectedOptions = React.useMemo(
    () => options.filter((option) => values.includes(option.value)),
    [options, values]
  )

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchValue) return options
    
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue, searchable])

  const handleSelect = React.useCallback(
    (selectedValue: string) => {
      const newValues = values.includes(selectedValue)
        ? values.filter((v) => v !== selectedValue)
        : maxSelected && values.length >= maxSelected
        ? values
        : [...values, selectedValue]
      
      onValuesChange?.(newValues)
      setSearchValue("")
    },
    [values, onValuesChange, maxSelected]
  )

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearchValue("")
    }
  }, [])

  const displayText = React.useMemo(() => {
    if (selectedOptions.length === 0) return placeholder
    if (selectedOptions.length === 1) return selectedOptions[0].label
    return `${selectedOptions.length} options selected`
  }, [selectedOptions, placeholder])

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              selectedOptions.length === 0 && "text-muted-foreground",
              triggerClassName
            )}
          >
            {displayText}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className={cn("w-[--radix-popover-trigger-width] p-0", contentClassName)}
          align="start"
        >
          <Command>
            {searchable && (
              <CommandInput
                placeholder={searchPlaceholder}
                value={searchValue}
                onValueChange={setSearchValue}
              />
            )}
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled || (maxSelected ? values.length >= maxSelected && !values.includes(option.value) : false)}
                    onSelect={handleSelect}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        values.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}