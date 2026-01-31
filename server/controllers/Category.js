// explain the crete tags and find all tags
const Category=require("../models/Category");
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}


exports.createCategory= async (req,res) =>{
  try{
    // fetch details
    const {name,description}=req.body;

    //validate
    if(!name || !description){
      return res.status(400).json({
        success:false,
        message:" Details are filled completely ",
      })
    }

    //create an tags
    const categoryDetails=await Category.create({ 
      name: name,
			description: description,
    });

    // res
    res.status(200).json({
      success:true,
      categoryDetails,
      message:"category  Data is Successfully generated ",
    })


  }catch(err){
    res.status(500).json({
      success:false,
      message:" Something went wrong in creating  category ",
    })
  }
};



//-- finding all the tags
exports.showAllCategory=async (req,res) =>{
  try{
    const response=await Category.find({});
    //validate
    if(response.length === 0){
      return res.status(400).json({
        success:false,
        message:"Not category found "
      })
    }
    //res
    return res.status(200).json({
      success:true,
      data:response,
      message:"All category  are successfully fetched",
    })



  }catch(err){
    return res.status(500).json({
      success:false,
      message:" Something went wrong in fetching  category ",
    })

  }
};


//category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "CategoryId not Found",
      })
    }

    const categoryResponse = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec()

    if (!categoryResponse) {
      return res.status(404).json({
        success: false,
        message: "Category not Found",
      })
    }

    // ✅ other categories
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })

    let differentCategory = null
    if (categoriesExceptSelected.length > 0) {
      const randomIndex = getRandomInt(categoriesExceptSelected.length)
      differentCategory = await Category.findById(categoriesExceptSelected[randomIndex]._id)
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
    }

    // ✅ top courses from all categories
    const allCategories = await Category.find({})
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec()

    const allCourses = allCategories.flatMap((category) => category.courses)

    const mostSellingCourses = allCourses
      .sort(
        (a, b) =>
          (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0)
      )
      .slice(0, 10)

    return res.status(200).json({
      success: true,
      data: {
        categoryResponse,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (err) {
    console.log("categoryPageDetails error:", err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong in finding the category page details",
      error: err.message,
    })
  }
}
