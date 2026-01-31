const Section = require("../models/Section");
const Course = require("../models/Course");
const User = require("../models/User");
const subSection = require("../models/subSection");


// now we will define section controller
exports.createSection = async (req, res) => {
  try {
    // fetch the details 
    const { sectionName, courseId } = req.body;
    // validate
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: " details are Missing ",
      })
    }
    // then create section (subSection defaults to [])
    const sectionDbEntry = await Section.create({ sectionName, subSection: [] });

    // then connect the courses
    const response = await Course.findByIdAndUpdate({ _id: courseId }, {
      $push: { courseContent: sectionDbEntry._id }
    }, { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
    // use populate to display both  section and sub section
    //res
    res.status(200).json({
      success: true,
      response,
      message: "The section is Successfully created ",
    })


  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong in the creating the section"
    })
  }
};

exports.allSection = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "details are not found "
      })
    }

    const sectionDetails = await Course.findById(courseId)
      .populate("courseContent")
      .exec();

    res.status(200).json({
      success: true,
      sectionDetails,
      message: "all the sections"
    })

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "something went wrong in fetching all sections"
    })
  }
}


exports.updateSection = async (req, res) => {
  try {
    // fetch the sectionId and changeName
    const { name, sectionId, courseId } = req.body;

    // check validate
    if (!name || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Details  in complete ",

      })
    }

    // update the db
    const response = await Section.findByIdAndUpdate({ _id: sectionId }, { sectionName: name }, { new: true });


    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    //fetching the course
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        }
      })
      .exec()
    // res
    res.status(200).json({
      success: true,
      response: course,
      message: "The section is Successfully Updated ",
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong in the Updating  the section"
    })

  }
};

// -- delete the section ---//
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "sectionId or courseId not found",
      });
    }

    // remove section id from course
    await Course.findByIdAndUpdate(
      courseId,
      { $pull: { courseContent: sectionId } },
      { new: true }
    );

    // fetch section
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section Not Found",
      });
    }

    // delete all subsections of this section
    await subSection.deleteMany({ _id: { $in: section.subSection } });

    // delete section
    await Section.findByIdAndDelete(sectionId);

    // ✅ fetch updated course (important)
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      response: updatedCourse,
      message: "The section is Successfully Deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong in deleting the section",
    });
  }
};
