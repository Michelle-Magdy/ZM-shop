import { getWishlist, updateWishlist } from "@/lib/api/wishlist"
import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchWishlist = createAsyncThunk("/wishlist/fetchWishlist", async () => {
    const wishlist = await getWishlist();
    return wishlist;
})

export const syncWishlist = createAsyncThunk("/wishlist/sync", async (_, { getState }) => {
    const items = getState().wishlist.items;
    const wishlist = await updateWishlist({ items });
    return wishlist;
})

const initialState = {
    items: [],
    loading: false,
    error: false,
    lastAction: null
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const newItem = action.payload;
            const productFound = state.items.find(pr => pr.productId === newItem.productId);
            if (productFound) {
                state.lastAction = { status: "error", message: "Product is already in your wishlist." };
                return;
            }
            state.items.push(newItem);
            state.lastAction = { status: "success", message: "Product added to your wishlist." };
        },
        removeFromWishlist: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(pr => pr.productId !== productId);
            state.lastAction = { status: "success", message: "Product removed from your wishlist." };
        },
        clearWishlist: (state, action) => {
            const hideMessage = action.payload;
            state.items = [];
            state.lastAction = { status: "success", message: hideMessage ? null : "Wishlist cleared successfully." };
        },
        resetLastAction: (state) => {
            state.lastAction = null;
        }

    },
    extraReducers: (builder) => {
        builder.addCase(fetchWishlist.pending, (state) => {
            state.loading = true;
        });

        builder.addCase(fetchWishlist.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

        builder.addCase(fetchWishlist.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload.items;
        })
    }
})


export const { addToWishlist, removeFromWishlist, clearWishlist, resetLastAction } = wishlistSlice.actions;
export default wishlistSlice.reducer;