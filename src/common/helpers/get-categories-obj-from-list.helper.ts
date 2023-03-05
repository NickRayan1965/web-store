import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { isUUID } from 'class-validator';

export const GetCategoriesObjFromList = async (categoryList: string[], repository: Repository<Category>)=> {
    const categories: Category[] = [];
    if(categoryList){ 
        let querysById: Promise<Category>[] = [];
        let querysByName: Promise<Category>[] = [];
        const categoryNames: string[] = [];
        for(const category of categoryList) {
            if(isUUID(category)) {
                querysById.push(repository.findOneBy({id: category}));
                continue;
            }
            querysByName.push(repository.findOneBy({name: category}));
            categoryNames.push(category);   
        }
        const resultsById = await Promise.all(querysById);
        if (resultsById.some(category => !category)) throw new Error('Some of the category ids do not exist');
        categories.push(...resultsById);

        const resultsByName = await Promise.all(querysByName);
        const CategoryNamesInDb = resultsByName.map(category => {
            if(category) {
                categories.push(category);
                return category.name;
            }
        });
        categoryNames.forEach(categoryName => {
            if (!CategoryNamesInDb.includes(categoryName)) {
                categories.push(repository.create({name: categoryName}));
            }
        });
    };
    return categories;
}