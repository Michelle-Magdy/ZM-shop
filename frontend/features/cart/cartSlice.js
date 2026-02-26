import { getUserCart, updateCart } from "@/lib/api/cart";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCart = createAsyncThunk("/cart/fetchCart", async () => {
    const cart = await getUserCart();
    return cart;
})

export const syncCart = createAsyncThunk("/cart/sync", async (_, { getState }) => {
    const items = getState().cart.items;
    const cart = await updateCart(items);
    return cart;
})

const initialState = {
    items: [],
    loading: false,
    error: null,
    lastAction: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            let found = false;

            for (let i = 0; i < state.items.length; i++) {
                if (state.items[i].variant.sku === newItem.variant.sku) {
                    if (state.items[i].variant.stock === state.items[i].quantity) {
                        state.lastAction = { status: "error", message: "Out of stock." };
                        return;
                    }
                    else
                        state.items[i].quantity++;
                    found = true;
                    break;
                }
            }

            if (!found)
                state.items.push({ ...newItem, quantity: 1 });

            state.lastAction = { status: "success", message: `${newItem.title}\nadded to cart.` };
        },

        removeFromCart(state, action) {
            const sku = action.payload.sku;
            state.items = state.items.filter(item => item.variant.sku !== sku);
            state.lastAction = { status: "success", message: "Item removed!" };
        },

        increaseQuantity(state, action) {
            const sku = action.payload.sku;
            const item = state.items.find(it => it.variant.sku === sku);

            if (!item || item.variant.stock === item.quantity){
                state.lastAction = { status: "error", message: "Out of stock." };
                return;
            }

            item.quantity++;
            state.lastAction = { status: "success", message: null };
        },

        decreaseQuantity(state, action) {
            const sku = action.payload.sku;
            const item = state.items.find(it => it.variant.sku === sku);

            if (!item || item.quantity === 1)
                return;

            item.quantity--;
            state.lastAction = { status: "success", message: null };
        },

        clearCart(state, action) {
            const hideMessage = action.payload;
            state.items = [];
            state.lastAction = { status: "success", message: hideMessage ?  null : "Cart cleared." };
        },

        resetLastAction: (state) => { state.lastAction = null; }

    },
    extraReducers: (builder) => {
        builder.addCase(fetchCart.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(fetchCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        builder.addCase(fetchCart.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload.items;
        })
    }
});

export const { addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity, resetLastAction } = cartSlice.actions;
export default cartSlice.reducer;