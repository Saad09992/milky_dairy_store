export const getCount = async (req, res) => {
  return res.status(200).json({ count: 1 });
};
