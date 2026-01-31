const Section=require("../models/Section");
const SubSection=require("../models/subSection");
const {uploadImageAtCloudinary}=require("../utils/imageUploader");
require("dotenv").config();

// title,time duration ,description ,video url 

//  create update delete
exports.createSubSection = async (req, res) => {
  try {
    const { title, description, sectionId } = req.body

    if (!title || !description || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Details are incomplete",
      })
    }

    if (!req.files || !req.files.video) {
      return res.status(400).json({
        success: false,
        message: "Video is required",
      })
    }

    const video = req.files.video

    const videoInfo = await uploadImageAtCloudinary(
      video,
      process.env.FOLDER_NAME
    )

    const subSectionDbEntry = await SubSection.create({
      title,
      description,
      videoUrl: videoInfo.secure_url,
      timeDuration: `${videoInfo.duration}`,   // ✅ auto duration
    })

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSectionDbEntry._id } },
      { new: true }
    ).populate("subSection")

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "Sub Section created Successfully",
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong with the sub section",
      error: err.message,
    })
  }
}

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body

    // ✅ validations
    if (!sectionId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "sectionId and subSectionId are required",
      })
    }

    const subSection = await SubSection.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    // ✅ update fields if provided
    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }

    // ✅ update video if provided
    if (req.files && req.files.video) {
      const video = req.files.video

      // ✅ correct function name
      const uploadDetails = await uploadImageAtCloudinary(
        video,
        process.env.FOLDER_NAME
      )

      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // ✅ return updated section with populated subsections
    const updatedSection = await Section.findById(sectionId).populate("subSection")

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the subsection",
      error: error.message,
    })
  }
}


exports.deleteSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId } = req.body

    // ✅ validate
    if (!sectionId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "sectionId and subSectionId are required",
      })
    }

    // ✅ remove subsection id from section
    await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } },
      { new: true }
    )

    // ✅ delete subsection
    await SubSection.findByIdAndDelete(subSectionId)

    // ✅ return updated section with populated subsections
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    return res.status(200).json({
      success: true,
      message: "Sub Section deleted successfully",
      data: updatedSection,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting subsection",
      error: err.message,
    })
  }
}
