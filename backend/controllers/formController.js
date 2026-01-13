const Form = require("../models/formModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleWare/asyncErrors");
const SignupFeatures = require("../utils/signupFeatures");
const OldLead = require("../models/oldLeadModel");
const OldDataFeatures = require("../utils/oldDataFeatures");

// @desc    Get all form data
// @route   GET /api/forms
// @access  Public or Protected (based on authentication needs)
// exports.getFormData = catchAsyncError(async (req, res) => {

//     const forms = await Form.find(); // Fetch all form data

//     if (!forms) {
//         return next(new ErrorHandler("forms Can not be Sent", 400));
//     }

//     res.status(200).json({
//         success: true,
//         count: forms.length,
//         data: forms,
//     });

// })

exports.deleteForm = catchAsyncError(async (req, res, next) => {
    const form = await Form.findById(req.params.id);

    if (!form) {
        return next(new ErrorHandler("Form not found", 404));
    }

    await form.deleteOne();

    res.status(200).json({
        success: true,
        message: "Form deleted successfully",
    });
});

exports.getFormData = catchAsyncError(async (req, res) => {
    const { keyword } = req.query;
    const resultPerPage = Number(req.query.pageSize) || 10;
    const leadCount = await Form.countDocuments();

    const apiFeatures = new SignupFeatures(
        Form.find(),
        req.query
    )
        .search()
        .filter()
        .pagination(resultPerPage);

    let leads = await apiFeatures.query;
    res.status(200).json({
        success: true,
        data: leads,
        leadCount,
    });
});


exports.getOldData = catchAsyncError(async (req, res) => {
    const { keyword } = req.query;
    const resultPerPage = Number(req.query.pageSize) || 10;
    const leadCount = await OldLead.countDocuments();

    const apiFeatures = new OldDataFeatures(
        OldLead.find()
            .populate({
                path: "assigned.user",
                select: "userName userEmail role"
            })
            .populate({
                path: "comments.postedBy",
            }),
        req.query
    )
        .search()
        .filter()
        .pagination(resultPerPage);

    let leads = await apiFeatures.query;
    res.status(200).json({
        success: true,
        data: leads,
        leadCount,
    });
});

exports.updateOldLead = catchAsyncError(async (req, res) => {
    const { id } = req.params;
    console.log("Updating Old Lead with ID:", req.body);
    const updateSet = {};

    if (req.body.status) updateSet.status = req.body.status;
    if (req.body.companyName) updateSet.companyName = req.body.companyName;
    if (req.body.comments) updateSet.comments = req.body.comments;
    // Add other top-level fields if needed in future

    if (req.body.assigned) {
        updateSet.assigned = req.body.assigned.map(assignee => {
            if (!assignee.assignedAt) {
                assignee.assignedAt = new Date();
            }
            assignee.updatedAt = new Date();

            if (assignee.status === "FollowUp" && assignee.followUpEndDate) {
                assignee.followUp = {
                    isActive: true,
                    startDate: new Date(),
                    endDate: new Date(assignee.followUpEndDate),
                };
                delete assignee.followUpEndDate;
            } else if (assignee.status !== "FollowUp") {
                assignee.followUp = {
                    isActive: false,
                    startDate: null,
                    endDate: null,
                };
            }

            return assignee;
        });
    }

    const updateOps = { $set: updateSet };

    // if (req.body.comments) {
    //     const newComment = {
    //         text: req.body.comments,
    //         postedBy: req.user._id, // Assuming authentication middleware sets req.user
    //         createdAt: new Date(),
    //     };
    //     updateOps.$push = { comments: newComment };
    // }

    const updatedLead = await OldLead.findByIdAndUpdate(id, updateOps, { new: true });

    if (!updatedLead) {
        return res.status(404).json({
            success: false,
            message: "Old Lead not found",
        });
    }

    res.status(200).json({
        success: true,
        data: updatedLead,
    });
});