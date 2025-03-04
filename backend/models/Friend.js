const { supabase } = require('../utils/supabaseClient');

const getAll = async () => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch friends: ${error.message}`);
  }
};

const create = async (friendData, userId) => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .insert([{ 
        ...friendData,
        created_by: userId 
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to create friend: ${error.message}`);
  }
};

const update = async (id, friendData) => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .update(friendData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to update friend: ${error.message}`);
  }
};

const remove = async (id) => {
  try {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(`Failed to delete friend: ${error.message}`);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};