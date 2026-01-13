import { FunctionComponent } from "react";
import { FormikErrors } from "formik";

interface IUploadFile {
  // For Formik integration
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<any>> | Promise<void>;
  errors?: FormikErrors<any>;
  touched?: any;
  values?: any;
  
  // For direct usage without Formik
  onChange?: (file: File | File[] | null) => void;
  error?: string;
  value?: File | File[] | null;
  
  // Common props
  name: string;
  accept?: string;
  multiple?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
//   label?: string;
  showFileName?: boolean;
  maxSize?: number; // in MB
  allowedTypes?: string[];
}

const UploadFile: FunctionComponent<IUploadFile> = ({
  // Formik props
  setFieldValue,
  errors,
  touched,
  values,
  
  // Direct props
  onChange,
  error,
  value,
  
  // Common props
  name,
  accept,
  multiple = false,
  placeholder = "Choose file(s)",
  className = "",
  disabled = false,
  required = false,
//   label,
  showFileName = true,
  maxSize,
  allowedTypes
}) => {
  // Determine if we're using Formik or direct props
  const isFormik = !!setFieldValue;
  
  // Get current value
  const currentValue = isFormik ? values?.[name] : value;
  
  // Get current error
  const currentError = isFormik 
    ? (touched?.[name] && errors?.[name]) 
    : error;

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file size
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size should be less than ${maxSize}MB`;
    }
    
    // Check file type
    if (allowedTypes && allowedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isValidType = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return type.toLowerCase() === `.${fileExtension}`;
        }
        return file.type.includes(type);
      });
      
      if (!isValidType) {
        return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
      }
    }
    
    return null;
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    
    if (!files || files.length === 0) {
      // Handle file removal
      if (isFormik && setFieldValue) {
        setFieldValue(name, null);
      } else if (onChange) {
        onChange(null);
      }
      return;
    }

    if (multiple) {
      const fileArray = Array.from(files);
      
      // Validate each file
      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          alert(validationError);
          return;
        }
      }
      
      if (isFormik && setFieldValue) {
        setFieldValue(name, fileArray);
      } else if (onChange) {
        onChange(fileArray);
      }
    } else {
      const file = files[0];
      
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        alert(validationError);
        return;
      }
      
      if (isFormik && setFieldValue) {
        setFieldValue(name, file);
      } else if (onChange) {
        onChange(file);
      }
    }
  };

  // Get file names for display
  const getFileNames = () => {
    if (!currentValue) return null;
    
    if (Array.isArray(currentValue)) {
      return currentValue.map(file => file.name).join(', ');
    }
    
    return currentValue.name;
  };

  // Clear files
  const clearFiles = () => {
    if (isFormik && setFieldValue) {
      setFieldValue(name, null);
    } else if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="w-full">
      {/* Label */}
      {/* {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )} */}
      
      {/* File Input */}
      <div className="relative">
        <input
          type="file"
          id={name}
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className={`
            form-input w-full
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
            ${currentError ? 'border-red-500' : ''}
            ${className}
          `}
          placeholder={placeholder}
        />
        
        {/* Clear button */}
        {currentValue && !disabled && (
          <button
            type="button"
            onClick={clearFiles}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500 hover:text-red-700"
            title="Clear files"
          >
            ✕
          </button>
        )}
      </div>
      
      {/* File size and type info */}
      {(maxSize || allowedTypes) && (
        <div className="mt-1 text-xs text-gray-500">
          {maxSize && `Max size: ${maxSize}MB`}
          {maxSize && allowedTypes && ' • '}
          {allowedTypes && `Allowed: ${allowedTypes.join(', ')}`}
        </div>
      )}
      
      {/* Selected file names */}
      {showFileName && currentValue && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
          <span className="font-medium">Selected: </span>
          {getFileNames()}
        </div>
      )}
      
      {/* Error message */}
      {currentError && (
        <div className="mt-1 text-sm text-red-500">
          {typeof currentError === 'string' ? currentError : 'Invalid file'}
        </div>
      )}
    </div>
  );
};

export default UploadFile;