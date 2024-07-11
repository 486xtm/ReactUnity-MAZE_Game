import { Unity, useUnityContext } from 'react-unity-webgl'

function Connect2Unity() {
    const { unityProvider, requestFullscreen } = useUnityContext({
      loaderUrl: "unityBuild/Build/unityBuild.loader.js",
      dataUrl: "unityBuild/Build/unityBuild.data",
      frameworkUrl: "unityBuild/Build/unityBuild.framework.js",
      codeUrl: "unityBuild/Build/unityBuild.wasm",
    });

    function handleClickEnterFullscreen() {
        requestFullscreen(true);
    }
  
    return (
      <>
        <button onClick={handleClickEnterFullscreen}>Enter Fullscreen</button>
        <br/>
        <Unity unityProvider={unityProvider} style={{ width: 1024, height: 600,  }} />
      </>
    )
  }
  
  export default Connect2Unity
  