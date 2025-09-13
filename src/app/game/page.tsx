const GAME_LOADER = process.env.GAME_LOADER || "loader_v3.swf";

export default function Page() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        margin: 0,
        padding: 0,
      }}
    >
      <object
        id="AQWGame"
        type="application/x-shockwave-flash"
        name="flashContent"
        data={`/gamefiles/${GAME_LOADER}`}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <param name="loop" value="false" />
        <param name="scale" value="exactfit" />
        <param name="allowScriptAccess" value="always" />
        <param name="allowFullScreen" value="true" />
        <param name="menu" value="false" />
        <param name="wmode" value="direct" />
        <param name="flashvars" value="" />
      </object>
    </div>
  );
};
