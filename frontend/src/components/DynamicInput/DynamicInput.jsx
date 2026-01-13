// import React from 'react';
// import { FieldArray, Field, useFormikContext } from 'formik';
// import IconX from '../../Icon/IconX';

// const DynamicInput = ({ name }) => {
//     const { values } = useFormikContext();

//     return (
//         <FieldArray name={name}>
//             {({ push, remove }) => (
//                 <div>
//                     {values[name].length === 0 && push('')}
//                     {values[name].map((input, index) => (
//                         <div key={index} className="input-group flex gap-2">
//                             <Field className="form-input my-2" type="text" name={`${name}.${index}.value`} placeholder="Enter value" />
//                             <button type="button" onClick={() => remove(index)}>
//                                 <IconX />
//                             </button>
//                         </div>
//                     ))}
//                     <button type="button" onClick={() => push({ value: '' })}>
//                         Add Input
//                     </button>
//                 </div>
//             )}
//         </FieldArray>
//     );
// };

// export default DynamicInput;

import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import IconX from '../Icon/IconX';

const DynamicInput = ({ name , btnText = 'Add Service' }) => {
    const { values, setFieldValue } = useFormikContext();

    return (
        <FieldArray name={name}>
            {({ push, remove }) => (
                <div>
                    {values[name]?.length === 0 && push('')}
                    {values[name]?.map((input, index) => (
                        <div key={index} className="input-group flex gap-2">
                            <input
                                className="form-input my-2"
                                type="text"
                                name={`${name}.${index}`}
                                value={input}
                                onChange={(e) => {
                                    setFieldValue(`${name}.${index}`, e.target.value);
                                }}
                                placeholder="Enter value"
                            />
                            <button type="button" onClick={() => remove(index)}>
                                <IconX />
                            </button>
                        </div>
                    ))}
                    <button className="btn btn-primary my-2" type="button" onClick={() => push('')}>
                        {btnText}
                    </button>
                </div>
            )}
        </FieldArray>
    );
};

export default DynamicInput;
