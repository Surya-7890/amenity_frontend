import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    total: 0,
    amount: 0,
    balance: 0,
    id: ''
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.amount = 0;
        },
        addItem: (state, action) => {
            const itemId = action.payload.id;
            const name = action.payload.name;
            const price = action.payload.price;
            state.items.push({ itemId, count: 1, name, price });
            state.amount = state.amount + 1;
            state.total = state.total + price;
        },
        increaseItemCount: (state, action) => {
            const itemId = action.payload;
            const item = state.items.find((item) => item.itemId === itemId);
            item.count = item.count + 1;
            state.amount = state.amount + 1;
            state.total = state.total + item.price; 
        },
        decreaseItemCount: (state, action) => {
            const itemId = action.payload;
            const item = state.items.find((item) => item.itemId === itemId);
            item.count = item.count - 1;
            state.amount = state.amount - 1;
            if (item.count === 0) {
                state.items = state.items.filter(element => element.itemId !== item.itemId)
            }
            state.total = state.total - item.price; 
        },
        setUserInfo: (state, action) => {
            const id = action.payload.id;
            const balance = action.payload.balance;
            state.balance = balance;
            state.id = id;
        },
        placeOrder: (state, action) => {
            const total = action.payload;
            state.balance = state.balance - total;
            state.items = [];
            state.total = 0;
            state.amount = 0;
        }
    }
});

export const { clearCart, addItem, increaseItemCount, decreaseItemCount, setUserInfo, placeOrder } = cartSlice.actions;

export default cartSlice.reducer;