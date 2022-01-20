import { FireFilled } from "@ant-design/icons";

const styles = {
  token: {
    padding: "0 7px",
    height: "42px",
    gap: "5px",
    width: "fit-content",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
};
function TokenPrice() {


  return (
    <div style={styles.token}>
      <FireFilled />
      <span >
        Runes
      </span>
    </div>
  );
}
export default TokenPrice;
