attribute highp vec4 vertexPosition;
attribute highp vec3 vertexNormal;
attribute highp vec2 vertexUV;

uniform highp mat4 viewMatrix;
uniform highp mat4 modelMatrix;
uniform highp mat4 projectionMatrix;

varying highp vec2 textureCoord;
varying highp vec3 light;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vertexPosition;
    textureCoord = vertexUV;

    // Ambient lighting
    float ambientStrength = 0.3;
    vec3 ambientColor = vec3(1, 1, 1);
    vec3 ambientLight = ambientColor * ambientStrength;

    // Diffuse lighting
    vec3 diffuseColor = vec3(1, 1, 1);
    vec3 lightDirection = normalize(vec3(20, 30, 0));
    float diffuseStrength = max(dot(vertexNormal, lightDirection), 0.0);
    vec3 diffuseLight = diffuseColor * diffuseStrength;

    light = ambientLight + diffuseLight;
}
