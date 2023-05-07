import { MinusSquareOutlined } from "@ant-design/icons";

function Item({ element }) {
  return (
    <>
      <MinusSquareOutlined style={{color: "orange"}}/>
      <span style={{color: "#000"}}>&#160;{element}</span>
    </>
  )
}

export default Item