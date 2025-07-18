import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique:true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
divisionSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name?.toLocaleLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;
    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`;
    }
    this.slug = slug;
  }
  next()
})
divisionSchema.pre("findOneAndUpdate", async function (next) {
  
  const division = this.getUpdate() as Partial<IDivision>
   if (division.name) {
     const baseSlug = division.name?.toLocaleLowerCase().split(" ").join("-");
     let slug = `${baseSlug}-division`;
     let counter = 0;
     while (await Division.exists({ slug })) {
       slug = `${baseSlug}-division-${counter++}`;
     }
     division.slug = slug;
   }
  next()
})
export const Division = model<IDivision>("Division", divisionSchema);
