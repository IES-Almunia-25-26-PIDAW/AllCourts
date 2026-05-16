import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { enUS, es } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { formatDateKey, parseDateKey } from "@/utils/formatters";
import CSS from "./BookingCalendar.module.scss";

type BookingCalendarProps = {
	value: string;
	onChange: (value: string) => void;
};

/**
 * @component BookingCalendar
 * Selector de fecha basado en DayPicker para reservar pistas.
 *
 * @param value Fecha activa en formato de clave serializada.
 * @param onChange Callback que recibe la nueva fecha seleccionada.
 */
export default function BookingCalendar({
	value,
	onChange,
}: BookingCalendarProps) {
	const { i18n } = useTranslation();
	const locale = i18n.language.startsWith("en") ? enUS : es;

	const selectedDate = useMemo(() => parseDateKey(value), [value]);
	const today = useMemo(
		() =>
			new Date(
				new Date().getFullYear(),
				new Date().getMonth(),
				new Date().getDate(),
			),
		[],
	);
	const currentMonth = useMemo(
		() => new Date(today.getFullYear(), today.getMonth(), 1),
		[today],
	);

	return (
		<section className={CSS.calendarCard}>
			<DayPicker
				mode="single"
				selected={selectedDate}
				onSelect={(date) => onChange(date ? formatDateKey(date) : "")}
				defaultMonth={currentMonth}
				startMonth={currentMonth}
				disabled={{ before: today }}
				locale={locale}
				showOutsideDays={false}
				className={CSS.picker}
			/>
		</section>
	);
}
