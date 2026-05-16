import {
	useDispatch,
	useSelector,
	type TypedUseSelectorHook,
} from "react-redux";
import type { AppDispatch, RootState } from "./index";

/**
 * Hook tipado para despachar acciones de Redux con `AppDispatch`.
 *
 * @returns {AppDispatch} Función `dispatch` tipada.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Hook tipado para seleccionar estado global de Redux con `RootState`.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useDispatch, useSelector };
