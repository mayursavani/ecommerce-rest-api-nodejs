const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      reuired: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default:
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimg.freepik.com%2Ffree-photo%2Fonline-message-blog-chat-communication-envelop-graphic-icon-concept_53876-139717.jpg&tbnid=EPqD2moyJ8ff1M&vet=12ahUKEwiF0ees0Oz-AhXMJrcAHSVACYwQMygBegUIARDnAQ..i&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fblog&docid=IpGZQDaohdsJoM&w=626&h=355&q=blog%20images&ved=2ahUKEwiF0ees0Oz-AhXMJrcAHSVACYwQMygBegUIARDnAQ",
    },
    author: {
      type: String,
      default: "admin",
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
