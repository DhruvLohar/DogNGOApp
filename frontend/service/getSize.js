export const getFileSizeFromBase64 = (base64String) => {
    // Remove header if present (e.g., 'data:image/jpeg;base64,')
    const base64WithoutHeader = base64String.replace(/^data:[^;]+;base64,/, '');

    // Calculate the length of the string in bytes
    const fileSizeInBytes = (base64WithoutHeader.length * 3) / 4;

    // Calculate the file size in kilobytes
    const fileSizeInKB = fileSizeInBytes / 1024;

    // Calculate the file size in megabytes
    const fileSizeInMB = fileSizeInKB / 1024;

    return fileSizeInMB;
}