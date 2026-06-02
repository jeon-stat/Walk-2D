import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../auth/AuthProvider";
import { theme } from "../constants/theme";
import { useStepData } from "../data/stepDataProvider";
import {
  DEFAULT_FRIEND_GROUPS,
  buildFriendRankingData,
  filterFriendsByGroup,
  getFriendGroupIds,
  sortFriendCards,
  toggleFriendGroupMembership,
  type FriendCard,
  type FriendGroup,
} from "../data/mockFriendData";
import { buildCharacterViewModel } from "../game/characterState";
import { getStreak } from "../game/progression";

const VIEW_TABS = [
  { id: "ranking", label: "랭킹" },
  { id: "list", label: "목록" },
];

const RANK_TABS = [
  { id: "daily", label: "일간" },
  { id: "weekly", label: "주간" },
  { id: "streak", label: "연속" },
];

const RANK_BADGE_COLORS: Record<number, { backgroundColor: string; color: string; borderColor: string }> = {
  1: { backgroundColor: "#f6d86a", color: "#8d5b00", borderColor: "#e7b93c" },
  2: { backgroundColor: "#e7edf3", color: "#66707a", borderColor: "#c7d0da" },
  3: { backgroundColor: "#e8c29e", color: "#8a4f1f", borderColor: "#d59d6f" },
};

export function FriendsScreen() {
  const { currentUser } = useAuth();
  const { today, history, goal, admin } = useStepData();
  const [viewMode, setViewMode] = useState<"ranking" | "list">("ranking");
  const [rankMode, setRankMode] = useState<"daily" | "weekly" | "streak">("daily");
  const [groups, setGroups] = useState<FriendGroup[]>(() => DEFAULT_FRIEND_GROUPS.map((group) => ({ ...group })));
  const [friendGroupState, setFriendGroupState] = useState<Record<string, string[]>>({});
  const [selectedGroupId, setSelectedGroupId] = useState("all");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [renameGroupName, setRenameGroupName] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 390));

  useEffect(() => {
    const onResize = () => setWindowWidth(typeof window !== "undefined" ? window.innerWidth : 390);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const characterViewState = useMemo(
    () => buildCharacterViewModel({ todayRecord: today, history, goal, admin }),
    [admin, goal, history, today],
  );

  const weeklySteps = useMemo(() => history.slice(0, 7).reduce((sum, record) => sum + (record?.steps ?? 0), 0), [history]);

  const friends = useMemo(
    () =>
      buildFriendRankingData({
        currentUser,
        todayRecord: today,
        weeklySteps,
        streak: getStreak(history, goal),
        energyLevel: characterViewState.energyLevel,
        longTermState: characterViewState.longTermState,
        skinTone: admin?.skinTones?.find((tone) => tone.id === admin?.skinToneId)?.color ?? null,
      }),
    [admin?.skinToneId, admin?.skinTones, characterViewState.energyLevel, characterViewState.longTermState, currentUser, goal, history, today, weeklySteps],
  );

  useEffect(() => {
    setFriendGroupState((current) => {
      const next = { ...current };
      for (const friend of friends) {
        if (!next[friend.id]) {
          next[friend.id] = getFriendGroupIds(friend);
        }
      }
      return next;
    });
  }, [friends]);

  const mergedFriends = useMemo(
    () =>
      friends.map((friend) => ({
        ...friend,
        groupIds: getFriendGroupIds(friend, friendGroupState),
      })),
    [friendGroupState, friends],
  );

  const groupCounts = useMemo(() => buildGroupCounts(groups, mergedFriends), [groups, mergedFriends]);
  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? groups[0] ?? DEFAULT_FRIEND_GROUPS[0],
    [groups, selectedGroupId],
  );

  useEffect(() => {
    setRenameGroupName(selectedGroup && !selectedGroup.system ? selectedGroup.name : "");
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedFriendId && mergedFriends.every((friend) => friend.id !== selectedFriendId)) {
      setSelectedFriendId(mergedFriends[0]?.id ?? null);
    }
  }, [mergedFriends, selectedFriendId]);

  const selectedGroupFriends = useMemo(() => filterFriendsByGroup(mergedFriends, selectedGroupId), [mergedFriends, selectedGroupId]);
  const rankedFriends = useMemo(() => sortFriendCards(selectedGroupFriends, rankMode), [rankMode, selectedGroupFriends]);
  const listFriends = useMemo(
    () =>
      [...mergedFriends].sort((a, b) => String(a.nickname ?? "").localeCompare(String(b.nickname ?? ""), "ko-KR")),
    [mergedFriends],
  );
  const selectedFriend = useMemo(
    () => listFriends.find((friend) => friend.id === selectedFriendId) ?? listFriends[0] ?? null,
    [listFriends, selectedFriendId],
  );

  const cardWidth = useMemo(() => {
    const horizontalPadding = 32;
    const usableWidth = Math.max(0, windowWidth - horizontalPadding);
    const gapSpace = 20;
    const baseWidth = Math.floor((usableWidth - gapSpace) / 3);
    return Math.max(104, Math.min(210, baseWidth));
  }, [windowWidth]);

  const previewSize = useMemo(() => Math.max(62, Math.min(126, Math.round(cardWidth * 0.68))), [cardWidth]);
  const cardPreviewSize = useMemo(() => Math.max(48, Math.min(72, Math.round(windowWidth / 8))), [windowWidth]);

  const createGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;

    const id = makeGroupId(name, groups);
    const nextGroups = [...groups, { id, name, system: false }];

    setGroups(nextGroups);
    setSelectedGroupId(id);
    setShowCreateGroup(false);
    setNewGroupName("");
  };

  const renameGroup = () => {
    const name = renameGroupName.trim();
    if (!name || !selectedGroup || selectedGroup.system) return;

    setGroups((current) => current.map((group) => (group.id === selectedGroup.id ? { ...group, name } : group)));
  };

  const deleteGroup = () => {
    if (!selectedGroup || selectedGroup.system) return;

    setGroups((current) => current.filter((group) => group.id !== selectedGroup.id));
    setFriendGroupState((current) => removeGroupFromAllFriends(current, selectedGroup.id));
    setSelectedGroupId("all");
  };

  const toggleMembership = (friendId: string, groupId: string) => {
    setFriendGroupState((current) => toggleFriendGroupMembership(current, friendId, groupId));
  };

  const selectedFriendGroupIds = selectedFriend ? getFriendGroupIds(selectedFriend, friendGroupState) : [];
  const selectableGroups = groups.filter((group) => !group.system);

  return (
    <div style={styles.screen}>
      <div style={styles.content}>
        <div style={styles.pageTitleWrap}>
          <div style={styles.pageTitle}>친구</div>
        </div>

        <div style={styles.tabCard}>
          <div style={styles.modeTabRow}>
            {VIEW_TABS.map((tab) => {
              const active = tab.id === viewMode;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setViewMode(tab.id as "ranking" | "list")}
                  style={{ ...styles.modeTab, ...(active ? styles.modeTabActive : null) }}
                >
                  <span style={{ ...styles.modeTabLabel, ...(active ? styles.modeTabLabelActive : null) }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={styles.groupCard}>
          <div style={styles.groupCardTop}>
            <div>
              <div style={styles.groupCardLabel}>그룹</div>
              <div style={styles.groupCardTitle}>{selectedGroup.name}</div>
            </div>
            {selectedGroup.system ? <div style={styles.systemBadge}>SYS</div> : null}
          </div>
          <div style={styles.groupCardMeta}>{groupCounts[selectedGroup.id] ?? 0}명</div>

          <div style={styles.groupChipScroller}>
            <div style={styles.groupChipRow}>
              {groups.map((group) => {
                const active = group.id === selectedGroupId;
                const count = groupCounts[group.id] ?? 0;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setShowCreateGroup(false);
                    }}
                    style={{ ...styles.groupChip, ...(active ? styles.groupChipActive : null) }}
                  >
                    <span style={{ ...styles.groupChipLabel, ...(active ? styles.groupChipLabelActive : null) }}>
                      {group.name} ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {viewMode === "list" ? (
            <>
              <div style={styles.groupActionCard}>
                <div style={styles.groupActionHeader}>
                  <div style={styles.groupActionTitle}>그룹 설정</div>
                  {selectedGroup.system ? <div style={styles.groupActionHint}>시스템 그룹</div> : null}
                </div>
                {selectedGroup.system ? (
                  <div style={styles.groupActionNote}>전체 그룹은 이름 변경과 삭제를 할 수 없어요.</div>
                ) : (
                  <>
                    <div style={styles.inlineInputRow}>
                      <input
                        value={renameGroupName}
                        onChange={(event) => setRenameGroupName(event.target.value)}
                        placeholder="그룹명"
                        style={styles.textInput}
                      />
                      <button type="button" onClick={renameGroup} style={styles.secondaryButton}>
                        <span style={styles.secondaryButtonLabel}>이름 변경</span>
                      </button>
                    </div>
                    <button type="button" onClick={deleteGroup} style={styles.dangerButton}>
                      <span style={styles.dangerButtonLabel}>그룹 삭제</span>
                    </button>
                  </>
                )}
              </div>

              <div style={styles.groupActionCard}>
                <div style={styles.groupActionHeader}>
                  <div style={styles.groupActionTitle}>그룹</div>
                  <button
                    type="button"
                    onClick={() => setShowCreateGroup((current) => !current)}
                    style={{ ...styles.groupActionToggle, ...(showCreateGroup ? styles.groupActionToggleActive : null) }}
                  >
                    <span style={{ ...styles.groupActionToggleLabel, ...(showCreateGroup ? styles.groupActionToggleLabelActive : null) }}>
                      ＋ 새 그룹 만들기
                    </span>
                  </button>
                </div>

                {showCreateGroup ? (
                  <div style={styles.inlineInputRow}>
                    <input
                      value={newGroupName}
                      onChange={(event) => setNewGroupName(event.target.value)}
                      placeholder="그룹명"
                      style={styles.textInput}
                    />
                    <button type="button" onClick={createGroup} style={styles.primaryButton}>
                      <span style={styles.primaryButtonLabel}>생성</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        {viewMode === "ranking" ? (
          <>
            <div style={styles.rankTabCard}>
              <div style={styles.rankTabRow}>
                {RANK_TABS.map((tab) => {
                  const active = tab.id === rankMode;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setRankMode(tab.id as "daily" | "weekly" | "streak")}
                      style={{ ...styles.rankTab, ...(active ? styles.rankTabActive : null) }}
                    >
                      <span style={{ ...styles.rankTabLabel, ...(active ? styles.rankTabLabelActive : null) }}>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={styles.listHeader}>
              <div style={styles.listTitle}>친구 목록</div>
            </div>

            {rankedFriends.length ? (
              <div style={styles.gridWrap}>
                {rankedFriends.map((friend, index) => (
                  <FriendRankCard
                    key={String(friend.id)}
                    friend={friend}
                    rank={index + 1}
                    isMe={Boolean(friend.isMe)}
                    rankMode={rankMode}
                    cardWidth={cardWidth}
                    previewSize={previewSize}
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </>
        ) : (
          <>
            <div style={styles.listHeader}>
              <div style={styles.listTitle}>친구 목록</div>
            </div>

            <div style={styles.friendGrid}>
              {listFriends.map((friend) => {
                const active = friend.id === selectedFriend?.id;
                return (
                  <button
                    key={String(friend.id)}
                    type="button"
                    onClick={() => setSelectedFriendId(friend.id)}
                    style={{ ...styles.friendGridCard, ...(active ? styles.friendGridCardSelected : null) }}
                  >
                    <FriendPreview friend={friend} size={cardPreviewSize} />
                    <div style={styles.friendGridName}>{friend.nickname}</div>
                    <div style={styles.friendGridHandle}>@{friend.handle}</div>
                  </button>
                );
              })}
            </div>

            {selectedFriend ? (
              <div style={styles.friendDetailCard}>
                <div style={styles.friendDetailTop}>
                  <div style={styles.friendDetailTitle}>{selectedFriend.nickname}</div>
                  <div style={styles.friendDetailHandle}>@{selectedFriend.handle}</div>
                </div>

                <div style={styles.groupChecklist}>
                  {selectableGroups.map((group) => {
                    const checked = selectedFriendGroupIds.includes(group.id);
                    return (
                      <button
                        key={String(group.id)}
                        type="button"
                        onClick={() => toggleMembership(selectedFriend.id, group.id)}
                        style={{ ...styles.checkRow, ...(checked ? styles.checkRowChecked : null) }}
                      >
                        <div style={{ ...styles.checkbox, ...(checked ? styles.checkboxChecked : null) }}>
                          {checked ? <span style={styles.checkboxMark}>✓</span> : null}
                        </div>
                        <div style={styles.checkLabel}>{group.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function FriendRankCard({
  friend,
  rank,
  isMe,
  rankMode,
  cardWidth,
  previewSize,
}: {
  friend: FriendCard;
  rank: number;
  isMe: boolean;
  rankMode: "daily" | "weekly" | "streak";
  cardWidth: number;
  previewSize: number;
}) {
  const rankBadge = getRankBadgeStyle(rank);
  const info = getModeInfo(friend, rankMode);

  return (
    <div style={{ ...styles.friendCard, ...(isMe ? styles.friendCardMe : null), width: cardWidth, maxWidth: 210 }}>
      <div style={styles.friendCardContent}>
        <div style={styles.friendHeader}>
          <div style={styles.rankNameRow}>
            <div style={{ ...styles.rankBadge, ...rankBadge.badgeStyle }}>
              <span style={{ ...styles.rankBadgeLabel, color: rankBadge.textColor }}>{rank}</span>
            </div>
            <div style={styles.friendName}>{friend.nickname}</div>
          </div>
          {isMe ? <div style={styles.meLabel}>나</div> : null}
        </div>

        <div style={styles.characterStage}>
          <FriendPreview friend={friend} size={previewSize} />
        </div>

        <div style={styles.primaryStatBlock}>
          <div style={styles.primaryStatLabel}>{info.primaryLabel}</div>
          <div style={styles.primaryStatValue}>{info.primaryValue}</div>
        </div>

        <div style={styles.footerInfoRow}>
          <FooterStat label={info.secondaryLeftLabel} value={info.secondaryLeftValue} />
          <FooterStat label={info.secondaryRightLabel} value={info.secondaryRightValue} />
        </div>
      </div>
    </div>
  );
}

function FriendPreview({ friend, size }: { friend: FriendCard; size: number }) {
  const skinTone = friend.skinTone ?? "#f4cbbb";

  return (
    <div style={{ ...styles.previewFigure, width: size, height: Math.round(size * 1.16) }}>
      <div style={{ ...styles.previewShadow, backgroundColor: softenColor(skinTone) }} />
      <div style={{ ...styles.previewHead, backgroundColor: skinTone }} />
      <div style={{ ...styles.previewBody, backgroundColor: skinTone }} />
    </div>
  );
}

function FooterStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.footerStat}>
      <div style={styles.footerStatLabel}>{label}</div>
      <div style={styles.footerStatValue}>{value}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={styles.emptyCard}>
      <div style={styles.emptyTitle}>이 그룹에는 아직 친구가 없어요.</div>
      <div style={styles.emptyText}>친구 목록에서 이 그룹에 친구를 추가해보세요.</div>
    </div>
  );
}

function buildGroupCounts(groups: FriendGroup[], friends: Array<{ groupIds?: ReadonlyArray<string> | string[] }>) {
  const counts: Record<string, number> = {};
  for (const group of groups) {
    counts[group.id] = 0;
  }

  for (const friend of friends) {
    for (const groupId of friend.groupIds ?? []) {
      if (counts[groupId] != null) {
        counts[groupId] += 1;
      }
    }
  }

  return counts;
}

function removeGroupFromAllFriends(groupState: Record<string, string[]>, groupId: string) {
  const next: Record<string, string[]> = {};

  for (const [friendId, groupIds] of Object.entries(groupState)) {
    next[friendId] = Array.from(new Set((groupIds ?? []).filter((id) => id !== groupId).concat("all")));
  }

  return next;
}

function makeGroupId(name: string, groups: FriendGroup[]) {
  const seed =
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w가-힣-]/g, "")
      .slice(0, 18) || "group";
  let candidate = `custom-${seed}`;
  let counter = 2;

  while (groups.some((group) => group.id === candidate)) {
    candidate = `custom-${seed}-${counter}`;
    counter += 1;
  }

  return candidate;
}

function getModeInfo(friend: FriendCard, rankMode: "daily" | "weekly" | "streak") {
  switch (rankMode) {
    case "weekly":
      return {
        primaryLabel: "👣 이번 주",
        primaryValue: `${formatNumber(friend.weeklySteps)}보`,
        secondaryLeftLabel: "📊 평균",
        secondaryLeftValue: `${formatNumber(Math.round((friend.weeklySteps ?? 0) / 7))}보`,
        secondaryRightLabel: "⚡ E",
        secondaryRightValue: `${friend.energyLevel}`,
      };
    case "streak":
      return {
        primaryLabel: "🔥 연속",
        primaryValue: `${friend.streak}일`,
        secondaryLeftLabel: "👣 누적",
        secondaryLeftValue: `${formatNumber(friend.weeklySteps)}보`,
        secondaryRightLabel: "❤ 장기",
        secondaryRightValue: friend.longTermState,
      };
    default:
      return {
        primaryLabel: "👣 오늘",
        primaryValue: `${formatNumber(friend.todaySteps)}보`,
        secondaryLeftLabel: "⚡ E",
        secondaryLeftValue: `${friend.energyLevel}`,
        secondaryRightLabel: "❤ 장기",
        secondaryRightValue: friend.longTermState,
      };
  }
}

function getRankBadgeStyle(rank: number) {
  if (rank <= 3) {
    const meta = RANK_BADGE_COLORS[rank];
    return {
      badgeStyle: {
        backgroundColor: meta.backgroundColor,
        borderColor: meta.borderColor,
      },
      textColor: meta.color,
    };
  }

  return {
    badgeStyle: {
      backgroundColor: "#f2f4f7",
      borderColor: "#d6dee8",
    },
    textColor: theme.colors.ink,
  };
}

function softenColor(color: string) {
  return `${color}22`;
}

function formatNumber(value: number) {
  return Number(value ?? 0).toLocaleString("ko-KR");
}

const styles: Record<string, CSSProperties> = {
  screen: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  content: {
    padding: "16px 16px 16px",
    display: "grid",
    gap: theme.spacing.md,
  },
  pageTitleWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 0",
  },
  pageTitle: {
    color: theme.colors.ink,
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: 0.6,
  },
  tabCard: {
    borderRadius: theme.radius.xl,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
  },
  modeTabRow: {
    display: "flex",
    gap: 8,
  },
  modeTab: {
    flex: 1,
    minHeight: 44,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
  },
  modeTabActive: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
  },
  modeTabLabel: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    fontWeight: 900,
  },
  modeTabLabelActive: {
    color: "#ffffff",
  },
  groupCard: {
    borderRadius: theme.radius.xl,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    display: "grid",
    gap: 10,
  },
  groupCardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  groupCardLabel: {
    color: theme.colors.inkSoft,
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  groupCardTitle: {
    marginTop: 4,
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: 900,
  },
  groupCardMeta: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    lineHeight: "18px",
    fontWeight: 700,
  },
  systemBadge: {
    padding: "5px 10px",
    borderRadius: theme.radius.pill,
    backgroundColor: "#edf6f0",
    color: "#4f7a57",
    fontSize: 10,
    fontWeight: 900,
  },
  groupChipScroller: {
    marginLeft: -16,
    marginRight: -16,
    overflowX: "auto",
    overflowY: "hidden",
  },
  groupChipRow: {
    display: "flex",
    gap: 8,
    paddingRight: 16,
    paddingLeft: 16,
  },
  groupChip: {
    minHeight: 36,
    padding: "0 12px",
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
  },
  groupChipActive: {
    backgroundColor: "#16302b",
    borderColor: "#16302b",
  },
  groupChipLabel: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    fontWeight: 800,
  },
  groupChipLabelActive: {
    color: "#ffffff",
  },
  groupActionCard: {
    borderRadius: theme.radius.lg,
    padding: 14,
    backgroundColor: "#fffdf8",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    display: "grid",
    gap: 10,
  },
  groupActionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  groupActionTitle: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: 900,
  },
  groupActionHint: {
    color: theme.colors.inkSoft,
    fontSize: 11,
    fontWeight: 700,
  },
  groupActionNote: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    lineHeight: "18px",
    fontWeight: 600,
  },
  groupActionToggle: {
    minHeight: 34,
    padding: "0 12px",
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
  },
  groupActionToggleActive: {
    backgroundColor: "#16302b",
    borderColor: "#16302b",
  },
  groupActionToggleLabel: {
    color: theme.colors.inkSoft,
    fontSize: 11,
    fontWeight: 900,
  },
  groupActionToggleLabelActive: {
    color: "#ffffff",
  },
  inlineInputRow: {
    display: "flex",
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    padding: "0 12px",
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: 700,
  },
  primaryButton: {
    minWidth: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.lg,
    backgroundColor: "#16302b",
    padding: "0 12px",
    border: "none",
  },
  primaryButtonLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 900,
  },
  secondaryButton: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceMuted,
    padding: "0 12px",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
  },
  secondaryButtonLabel: {
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: 900,
  },
  dangerButton: {
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.lg,
    backgroundColor: "#fff1ee",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#f0c7bf",
  },
  dangerButtonLabel: {
    color: "#9f4e33",
    fontSize: 12,
    fontWeight: 900,
  },
  rankTabCard: {
    borderRadius: theme.radius.xl,
    padding: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
  },
  rankTabRow: {
    display: "flex",
    gap: 8,
  },
  rankTab: {
    flex: 1,
    minHeight: 44,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
  },
  rankTabActive: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
  },
  rankTabLabel: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    fontWeight: 900,
  },
  rankTabLabelActive: {
    color: "#ffffff",
  },
  listHeader: {
    display: "grid",
    gap: 4,
  },
  listTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: 900,
  },
  friendGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  friendGridCard: {
    flexGrow: 1,
    flexBasis: "31%",
    minWidth: 94,
    maxWidth: "49%",
    borderRadius: theme.radius.lg,
    padding: 10,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  friendGridCardSelected: {
    backgroundColor: "#fff7ef",
    borderColor: "#d99d78",
  },
  friendGridName: {
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: 900,
    textAlign: "center",
  },
  friendGridHandle: {
    color: theme.colors.inkSoft,
    fontSize: 10,
    fontWeight: 700,
  },
  gridWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  friendCard: {
    position: "relative",
    borderRadius: theme.radius.xl,
    padding: 12,
    backgroundColor: "#fffdf8",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    aspectRatio: "0.68",
    overflow: "hidden",
  },
  friendCardContent: {
    flex: 1,
    position: "relative",
  },
  friendCardMe: {
    backgroundColor: "#fff7ef",
    borderColor: "#d99d78",
    boxShadow: "0 6px 12px rgba(36,50,71,0.08)",
  },
  friendHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  rankNameRow: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 6,
    minWidth: 0,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
  },
  rankBadgeLabel: {
    fontSize: 11,
    fontWeight: 900,
  },
  friendName: {
    flex: 1,
    color: theme.colors.ink,
    fontSize: 11,
    fontWeight: 900,
  },
  meLabel: {
    color: "#9f4e33",
    fontSize: 10,
    fontWeight: 900,
  },
  characterStage: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 28,
    bottom: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  previewFigure: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  previewShadow: {
    position: "absolute",
    bottom: "7%",
    width: "72%",
    height: "9%",
    borderRadius: 999,
    opacity: 0.55,
  },
  previewHead: {
    position: "absolute",
    top: "11%",
    width: "42%",
    aspectRatio: "1",
    borderRadius: 999,
    opacity: 0.98,
  },
  previewBody: {
    position: "absolute",
    bottom: "7%",
    width: "66%",
    height: "48%",
    borderRadius: 999,
    opacity: 0.98,
  },
  primaryStatBlock: {
    position: "absolute",
    left: 0,
    bottom: 52,
    zIndex: 2,
    maxWidth: "64%",
  },
  primaryStatLabel: {
    color: theme.colors.inkSoft,
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  primaryStatValue: {
    color: theme.colors.ink,
    fontSize: 18,
    lineHeight: "22px",
    fontWeight: 900,
  },
  footerInfoRow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    display: "flex",
    gap: 8,
    paddingTop: 10,
    borderTop: "1px solid rgba(0,0,0,0.06)",
  },
  footerStat: {
    flex: 1,
    minWidth: 0,
  },
  footerStatLabel: {
    color: theme.colors.inkSoft,
    fontSize: 9,
    fontWeight: 800,
    marginBottom: 2,
  },
  footerStatValue: {
    color: theme.colors.ink,
    fontSize: 11,
    fontWeight: 900,
  },
  friendDetailTop: {
    display: "grid",
    gap: 2,
  },
  friendDetailCard: {
    borderRadius: theme.radius.xl,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    display: "grid",
    gap: 8,
  },
  friendDetailTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: 900,
  },
  friendDetailHandle: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    fontWeight: 700,
  },
  groupChecklist: {
    display: "grid",
    gap: 8,
    marginTop: 4,
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
  },
  checkRowChecked: {
    backgroundColor: "#eef8f2",
    borderColor: "#b7d8c0",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#c7d0da",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  checkboxChecked: {
    backgroundColor: "#4f7a57",
    borderColor: "#4f7a57",
  },
  checkboxMark: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: 900,
  },
  checkLabel: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: 800,
  },
  emptyCard: {
    borderRadius: theme.radius.xl,
    padding: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
  },
  emptyTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: 900,
  },
  emptyText: {
    marginTop: 8,
    color: theme.colors.inkSoft,
    fontSize: 13,
    lineHeight: "20px",
    fontWeight: 700,
  },
};
