function Modal() {
  return (
    <div className="z-10 absolute">
      <form className="bg-white p-4">
        <h2 className="text-2xl font-bold">Create a new Chat</h2>
        <input type="text" placeholder="Select friends" />
        <input type="text" placeholder="Name chat" />
      </form>
    </div>
  );
}
export default Modal;
