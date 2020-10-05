const mandatoryParam = (envVarName: string) => {
    const value = process.env[envVarName];

    if (!value) {
        throw new Error(`Environment variable "${envVarName}" must be defined!`);
    }

    console.log(`Found mandatory environment variable: "${envVarName}"="${value}"`);

    return value;
}


export const apiBaseUrl = mandatoryParam('VUE_APP_API_ENDPOINT');
export const websocketBaseUrl = mandatoryParam('VUE_APP_WS_ENDPOINT');

