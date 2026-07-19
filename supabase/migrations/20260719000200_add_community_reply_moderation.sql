drop policy if exists "authenticated delete community replies" on community_replies;
create policy "authenticated delete community replies"
  on community_replies for delete
  to authenticated
  using (true);
