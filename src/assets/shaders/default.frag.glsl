varying highp vec2 textureCoord;
varying highp vec3 light;

uniform sampler2D sampler;

void main() {
    highp vec4 textureColor = texture2D(sampler, textureCoord);

    if (textureColor.a < 0.5) {
        discard;
    }

    gl_FragColor = vec4(textureColor.rgb * light, 1.0);
}
