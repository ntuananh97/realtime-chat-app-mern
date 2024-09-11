const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const { validateRequiredInput } = require("../utils");
const {
  returnInternalErrorResponse,
  returnInvalidErrorResponse,
  returnActionSuccessResponse,
  returnGetSuccessResponse,
} = require("../utils/returnResponse");

const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;
    console.log("sendMessage ~ receiverId:", receiverId)
    const userId = req.user._id;

    // Validate receiverId is array and not empty
    if (!Array.isArray(receiverId) || receiverId.length === 0) {
      return returnInvalidErrorResponse(res, {
        message: "ReceiverId must be an array and not empty",
      });
    }

    // Validate content is not empty
    const requiredFields = validateRequiredInput(req.body, ["content"]);

    if (requiredFields.length > 0) {
      return returnInvalidErrorResponse(res, {
        message: `The field ${requiredFields[0]} is required`,
      });
    }

    // Check conversation exist
    const totalMembers = [userId, ...receiverId];
    let conversation = await Conversation.findOne({
      members: { $all: totalMembers },
      $expr: { $eq: [{ $size: "$members" }, totalMembers.length] }

    });

    if (!conversation) {
      conversation = new Conversation({
        members: totalMembers,
      });
    }

    // create a new message
    const newMessage = new Message({
      senderId: userId,
      receiverId,
      content,
    });

    // Add message to conversation
    conversation.messages.push(newMessage._id);

    // save conversation and message
    await Promise.all([conversation.save(), newMessage.save()]);

    return returnActionSuccessResponse(res, {
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.log("error in send message", error);
    return returnInternalErrorResponse(res, {error});
  }
};

const getMessages = async (req, res) => {
  try {
    const { receiverIds } = req.query;
    const senderId = req.user._id;

    // Convert receiverIds to array
    const receiverIdArr = receiverIds?.split(",");
    console.log("getMessages ~ receiverIdArr:", receiverIdArr)
    if (!Array.isArray(receiverIdArr) || receiverIdArr.length === 0) {
      return returnGetSuccessResponse(res, {data: []});
    }


    // Get conversation by receiverIds and senderId
    const totalMembers = [senderId, ...receiverIdArr];

    const conversation = await Conversation.findOne({
      members: { $all: totalMembers },
      $expr: { $eq: [{ $size: "$members" }, totalMembers.length] }
    }).populate("messages");

    if (!conversation) {
      return returnGetSuccessResponse(res, {data: []});
    }
    
    return returnGetSuccessResponse(res, {data: conversation.messages});
  } catch (error) {
    console.log("error in get messages", error);
    return returnInternalErrorResponse(res, {error});
  }
};

module.exports = {
  sendMessage,
  getMessages
};
