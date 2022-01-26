import {createSlice, PayloadAction, configureStore	} from "@reduxjs/toolkit";
import {v1 as uuid} from "uuid";
import logger from "redux-logger";
import { Todo } from "./type";

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: "Learn React",
    isComplete: true
  },
  {
    id: uuid(),
    desc: "Learn Redux",
    isComplete: true
  },
  {
    id: uuid(),
    desc: "Learn Redux-ToolKit",
    isComplete: false
  }
];

const todosSlice = createSlice({
	name: 'todo',
	initialState: todosInitialState,
	reducers: {
		create: {
			reducer: (state, {payload}: PayloadAction<{id: string; desc: string; isComplete: boolean}>) => {
				state.push(payload);
			},
			// NOTE: prepare we make intermediate non pure actions. uuid() here, becase reducers must be clean
			prepare: ({desc}: {desc: string}) => ({
				payload: {
					id: uuid(),
					desc,
					isComplete: false
				}
			})
		},
		edit: (state, {payload}: PayloadAction<{id: string; desc: string}>) => {
			const todoToEdit = state.find(todo => todo.id === payload.id);
			if(todoToEdit) {
				todoToEdit.desc = payload.desc;
			}
		},
		toggle: (state, {payload}: PayloadAction<{id: string, isComplete: boolean}>) => {
			const todoToToggle = state.find(todo => todo.id === payload.id);
			if(todoToToggle) {
				todoToToggle.isComplete = payload.isComplete;
			}
		},
		remove: (state, {payload}: PayloadAction<{id: string}>) => {
			const index = state.findIndex(todo => todo.id === payload.id);
			if(index !== -1) {
				state.splice(index, 1);
			}
		}
	}
})

const selectedTodoSlice = createSlice({
	name: 'selectedTodo',
	initialState: null as string | null,
	reducers: {
		// NOTE: is case when state is primitive value, we don't mutate it,
		// we just return a new value of state
		select: (state, {payload}: PayloadAction<{id: string}>) => payload.id
	}
})

const counterSlice = createSlice({
	name: 'counter',
	initialState: 0,
	reducers: {},
	// NOTE: handling actions of othe reducers
	extraReducers: {
		[todosSlice.actions.create.type]: state => state + 1,
		[todosSlice.actions.edit.type]: state => state + 1,
		[todosSlice.actions.toggle.type]: state => state + 1,
		[todosSlice.actions.remove.type]: state => state + 1,
	}
})

export const {
	create: createTodoActionCreator,
	edit: editTodoActionCreator,
	toggle: toggeTodoActionCreator,
	remove: deleteTodoAcitonCreator,
} = todosSlice.actions

export const {
	select: selecTodoActionCreator,
} = selectedTodoSlice.actions;

const reducer = {
	todos: todosSlice.reducer,
	selectedTodo: selectedTodoSlice.reducer,
	counter: counterSlice.reducer,
}

export default configureStore({
	reducer,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})