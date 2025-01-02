import fs from 'fs';

interface Problem {
    id: string;
    fullBoilerPlate: string;
    inputs: string[];
    outputs: string[];
}

const languageIdtoExtension: Record<string, string> = {
    71: 'py',
    63: 'js',
    54: 'cpp',
};


const MOUNT_PATH =process.env.PROBLEM_PATH;
export async function getProblem(
    slug: string,
    languageId: string,
): Promise<Problem>{
    const fullboilerPlate = await getProblemFullBoilerPlate(slug, languageId);
    const inputs = await getProblemInputs(slug);
    const outputs = await getProblemOutputs(slug);
    return {
        id: slug,
        fullBoilerPlate: fullboilerPlate,
        inputs: inputs,
        outputs: outputs,
    }
}

async function getProblemFullBoilerPlate(slug: string, languageId: string): Promise<string>{
    return new Promise((resolve, reject) => {
        fs.readFile(
            `${MOUNT_PATH}/${slug}/full-boilerplate/function.${languageIdtoExtension[languageId]}`,
            'utf-8',
            (err, data) => {
                if (err){
                    reject(err);
                }else{
                    resolve(data);
                }
            }
        )
    });
}


async function getProblemInputs(slug: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(`${MOUNT_PATH}/${slug}/inputs`, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const inputPromises = files.map(file => {
                    return new Promise<string>((resolve, reject) => {
                        fs.readFile(`${MOUNT_PATH}/${slug}/inputs/${file}`, 'utf-8', (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        });
                    });
                });

                Promise.all(inputPromises)
                    .then(inputs => resolve(inputs))
                    .catch(reject);
            }
        });
    });
}

async function getProblemOutputs(slug: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(`${MOUNT_PATH}/${slug}/outputs`, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const inputPromises = files.map(file => {
                    return new Promise<string>((resolve, reject) => {
                        fs.readFile(`${MOUNT_PATH}/${slug}/inputs/${file}`, 'utf-8', (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(data);
                            }
                        });
                    });
                });

                Promise.all(inputPromises)
                    .then(inputs => resolve(inputs))
                    .catch(reject);
            }
        });
    });
}
