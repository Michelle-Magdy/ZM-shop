import mongoose from "mongoose";

const wishlistSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    },
  ],
});

wishlistSchema.pre("/^find/", function (next) {
  this.populate(
    "items.productId",
    "title price stock coverImage avgRating nReviews"
  );
  next();
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
