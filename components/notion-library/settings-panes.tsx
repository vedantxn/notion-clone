"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Plus, Search, Copy, Check, CircleHelp, Lock, ArrowUpRight, Send, UserRoundPlus, Table2, FileText, Code2, Type, UploadCloud, Pencil, MoreHorizontal, Smile, Monitor } from "lucide-react";
import { NotionAiMark } from "./icons";

/* ------------ shared primitives ------------ */
/** A string state that persists to localStorage (survives reloads). */
function usePersisted(key: string, initial: string) {
  const [val, setVal] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const v = localStorage.getItem(key);
        if (v !== null) return v;
      } catch {}
    }
    return initial;
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, val);
    } catch {}
  }, [key, val]);
  return [val, setVal] as const;
}

export function PaneHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <h1 className="text-[26px] font-bold text-[#2C2C2B]">{title}</h1>
      {sub && <p className="mt-1.5 text-[14px] text-[#787774]">{sub}</p>}
    </div>
  );
}

export function Group({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="mt-9">
      {title && <h2 className="text-[15px] font-semibold text-[#2C2C2B]">{title}</h2>}
      <div className={"border-t border-black/[0.06] " + (title ? "mt-1" : "")}>{children}</div>
    </div>
  );
}

export function Setting({ label, desc, control, danger }: { label: string; desc?: string; control: React.ReactNode; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-black/[0.06] py-3.5">
      <div className="min-w-0">
        <div className={"text-[14px] font-medium " + (danger ? "text-[#D44C47]" : "text-[#2C2C2B]")}>{label}</div>
        {desc && <div className="mt-0.5 text-[13px] leading-5 text-[#9B9A97]">{desc}</div>}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}

export function Select({ value, dim }: { value: string; dim?: boolean }) {
  return (
    <button
      onClick={() => toast(value)}
      className={
        "flex h-8 items-center gap-1.5 rounded-md border border-black/[0.12] px-2.5 text-[14px] hover:bg-black/[0.03] " +
        (dim ? "text-[#9B9A97] opacity-70" : "text-[#2C2C2B]")
      }
    >
      {value}
      <ChevronDown className="h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={2} />
    </button>
  );
}

export function Toggle({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button onClick={() => setOn((v) => !v)} className={"relative h-[20px] w-[34px] rounded-full transition-colors " + (on ? "bg-[#2383E2]" : "bg-black/[0.15]")} aria-label="Toggle">
      <span className={"absolute top-[2px] h-4 w-4 rounded-full bg-white shadow transition-all " + (on ? "left-[16px]" : "left-[2px]")} />
    </button>
  );
}

function Btn({ children, onClick, variant = "default" }: { children: React.ReactNode; onClick?: () => void; variant?: "default" | "blue" | "danger" }) {
  const cls =
    variant === "blue"
      ? "bg-[#2383E2] text-white hover:bg-[#1a73d0]"
      : variant === "danger"
        ? "border border-[#D44C47]/40 text-[#D44C47] hover:bg-[#D44C47]/[0.05]"
        : "border border-black/[0.12] text-[#2C2C2B] hover:bg-black/[0.03]";
  return (
    <button onClick={onClick ?? (() => toast(String(children)))} className={"flex h-8 shrink-0 items-center whitespace-nowrap rounded-md px-3 text-[14px] font-medium " + cls}>
      {children}
    </button>
  );
}

function Tile({ color, letter, name }: { color: string; letter: string; name: string }) {
  return (
    <button onClick={() => toast(name)} className="flex items-center gap-3 rounded-lg border border-black/[0.08] p-3 text-left transition-colors hover:bg-black/[0.02]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[15px] font-semibold text-white" style={{ backgroundColor: color }}>{letter}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium text-[#2C2C2B]">{name}</span>
      </span>
    </button>
  );
}

/* ------------ panes ------------ */
export function PreferencesPane() {
  return (
    <div className="max-w-[720px]">
      <PaneHead title="Preferences" sub="Choose how you want Notion to look and behave" />

      <Group title="Appearance">
        <Setting label="Theme" desc="Choose a theme for Notion on this device" control={<Select value="Use system setting" />} />
      </Group>

      <Group title="Input options">
        <Setting label="Use Enter to add a new line" desc="Applies to chat, comments, and other input fields. Press Cmd/Ctrl + Enter to send." control={<Toggle />} />
      </Group>

      <Group title="Language & time">
        <Setting label="Language" desc="Choose the language you want to use Notion in" control={<Select value="English (US)" />} />
        <Setting label="Number format" desc="Choose how numbers and currencies are formatted. Default uses your language setting." control={<Select value="Default" />} />
        <Setting label="Always show text direction controls" desc="Show the option to change text direction (left to right or right to left) in the editor, regardless of what language you're using" control={<Toggle />} />
        <Setting label="Start week on Monday" desc="This will affect the way your calendars appear in Notion" control={<Toggle />} />
        <Setting label="Date format" desc="Set the default format for new @date mentions" control={<Select value="Relative" />} />
        <Setting label="Set time zone automatically using your location" desc="Reminders, notifications, and emails will be delivered to you based on your time zone" control={<Toggle defaultOn />} />
        <Setting label="Time zone" desc="Choose your time zone" control={<Select value="(GMT+05:30) Calcutta" dim />} />
      </Group>

      <Group title="Desktop app">
        <div className="border-b border-black/[0.06] py-3.5">
          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-[#2C2C2B]">Open links in desktop app</div>
              <div className="mt-0.5 text-[13px] leading-5 text-[#9B9A97]">
                Open Notion links in the desktop app. This happens by default if you have the <span className="underline">macOS app</span> installed.
              </div>
            </div>
            <Toggle />
          </div>
          <div className="mt-3 flex items-center justify-between gap-6">
            <div className="text-[13px] leading-5 text-[#9B9A97]">
              To disable this and open links in your browser instead, go to <span className="font-medium text-[#5F5E59]">Settings</span> in the desktop app and turn on <span className="font-medium text-[#5F5E59]">Open Notion links in browser</span>.
            </div>
            <Btn>Open desktop app</Btn>
          </div>
        </div>
        <Setting label="Open on start" desc="Choose what page opens when you start Notion and when you switch workspaces" control={<Select value="Last visited page" />} />
      </Group>

      <Group title="Privacy">
        <Setting label="Cookie settings" desc="See the Cookie Notice for more information" control={<Select value="Customize" />} />
        <Setting label="Show my view history" desc="People with edit or full access will be able to see when you've viewed a page. Learn more." control={<Toggle defaultOn />} />
        <Setting label="Profile discoverability" desc="Users who know your email will see your Notion name and profile picture when inviting you to a new workspace. Learn more." control={<Toggle defaultOn />} />
      </Group>
    </div>
  );
}

const ACCOUNT_DEVICES = [
  { name: "macOS", thisDevice: true, active: "Now", loc: "San Francisco, CA, US" },
  { name: "macOS", active: "Today at 12:54 AM", loc: "San Francisco, CA, US" },
  { name: "macOS", active: "Today at 12:14 AM", loc: "San Francisco, CA, US" },
];

export function AccountPane() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = usePersisted("notion-clone:preferred-name", "Alex Morgan");
  return (
    <div className="max-w-[720px]">
      <PaneHead title="Profile" sub="Manage your profile, login information, and devices" />

      <Group title="Account">
        <div className="flex items-center gap-5 py-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E3E2E0] text-[26px] font-medium text-[#5F5E59]">A</span>
          <div>
            <div className="mb-1.5 text-[13px] font-medium text-[#787774]">Preferred name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-[320px] rounded-md border border-black/[0.12] px-3 py-2 text-[14px] text-[#2C2C2B] outline-none focus:border-[#2383E2]" />
          </div>
        </div>
        <div className="pb-3 text-[14px] text-[#787774]">
          <button onClick={() => toast("Add a photo")} className="font-medium text-[#2383E2]">Add a photo</button> or <button onClick={() => toast("Notion Faces")} className="font-medium text-[#2383E2]">create a custom self-portrait</button> with Notion Faces
        </div>
      </Group>

      <Group title="Account security">
        <Setting label="Email" desc="alex.morgan@example.com" control={<Btn onClick={() => toast("Manage emails")}>Manage emails</Btn>} />
        <Setting label="Password" desc="Set a password for your account" control={<Btn onClick={() => toast("Add password")}>Add password</Btn>} />
        <Setting label="Two-step verification" desc="Add another layer of security to your account" control={
          <button onClick={() => toast("Add verification method")} className="flex h-8 items-center whitespace-nowrap rounded-md border border-black/[0.08] px-3 text-[14px] font-medium text-[#C6C4C0]">Add verification method</button>
        } />
        <Setting label="Passkeys" desc="Sign in with on-device biometric authentication" control={<Btn onClick={() => toast("Add passkey")}>Add passkey</Btn>} />
      </Group>

      <Group title="Support">
        <Setting label="Support access" desc="Grant Notion's support team temporary access to your account to help troubleshoot problems or recover content on your behalf. You can revoke access anytime." control={<Toggle />} />
        <Setting danger label="Delete my account" desc="Permanently delete your account. You'll no longer be able to access your pages or any of the workspaces you belong to." control={<Btn variant="danger">Delete my account</Btn>} />
      </Group>

      {/* Devices */}
      <div className="mt-9">
        <div className="flex items-center gap-1 text-[15px] font-semibold text-[#2C2C2B]">Devices <CircleHelp className="h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={1.8} /></div>
        <div className="mt-1 flex items-center justify-between border-t border-black/[0.06] py-3.5">
          <div>
            <div className="text-[14px] font-medium text-[#2C2C2B]">Log out of all devices</div>
            <div className="mt-0.5 text-[13px] text-[#9B9A97]">Log out of active sessions on all your devices, other than this one</div>
          </div>
          <Btn variant="danger">Log out of all devices</Btn>
        </div>
        <div className="flex items-center border-b border-black/[0.06] pb-2 text-[13px] font-medium text-[#9B9A97]">
          <div className="flex-1">Device Name</div>
          <div className="flex w-[180px] items-center gap-1">Last Active <CircleHelp className="h-3 w-3" strokeWidth={1.8} /></div>
          <div className="w-[220px]">Location</div>
          <div className="w-[80px]" />
        </div>
        {ACCOUNT_DEVICES.map((d, i) => (
          <div key={i} className="flex items-center py-3 text-[14px]">
            <div className="flex flex-1 items-center gap-2.5">
              <Monitor className="h-5 w-5 text-[#9B9A97]" strokeWidth={1.7} />
              <div>
                <div className="text-[14px] text-[#2C2C2B]">{d.name}</div>
                {d.thisDevice && <div className="text-[13px] font-medium text-[#2383E2]">This Device</div>}
              </div>
            </div>
            <div className="w-[180px] text-[13px] text-[#5F5E59]">{d.active}</div>
            <div className="w-[220px] text-[13px] text-[#5F5E59]">{d.loc}</div>
            <div className="w-[80px]">{!d.thisDevice && <button onClick={() => toast("Logged out")} className="rounded-md border border-black/[0.12] px-2 py-1 text-[13px] font-medium text-[#2C2C2B] hover:bg-black/[0.03]">Log out</button>}</div>
          </div>
        ))}
        <div className="py-2 text-[13px] text-[#9B9A97]">All devices loaded</div>
      </div>

      {/* User ID */}
      <div className="mt-9">
        <h2 className="text-[15px] font-semibold text-[#2C2C2B]">User ID</h2>
        <div className="mt-1 flex items-center justify-between border-t border-black/[0.06] py-3.5">
          <div className="text-[14px] font-medium text-[#2C2C2B]">User ID</div>
          <button onClick={() => { setCopied(true); toast("Copied user ID"); }} className="flex items-center gap-2 text-[13px] text-[#5F5E59] hover:text-[#2C2C2B]">
            399d872b-594c-81ee-a8db-00026eb3e310
            {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function NumRow({ n, label, defaultOn, locked }: { n: number; label: string; defaultOn?: boolean; locked?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-[12px] font-medium text-[#5F5E59]">{n}</span>
      <span className="text-[14px] text-[#2C2C2B]">{label}</span>
      <CircleHelp className="h-3.5 w-3.5 text-[#C6C4C0]" strokeWidth={1.8} />
      <div className="ml-auto flex items-center gap-2">
        {locked && <Lock className="h-3.5 w-3.5 text-[#C6C4C0]" strokeWidth={1.8} />}
        <Toggle defaultOn={defaultOn} />
      </div>
    </div>
  );
}

export function NotificationsPane() {
  return (
    <div className="max-w-[720px]">
      <PaneHead title="Notifications" sub="Decide when and how you want to be notified" />

      <Group title="In-app notifications">
        <div className="pt-3.5">
          <div className="text-[14px] font-medium text-[#2C2C2B]">Live meeting activity</div>
          <div className="mt-0.5 text-[13px] leading-5 text-[#9B9A97]">Configure which in-app popups appear when you&rsquo;re in video conferences and taking AI Meeting Notes</div>
        </div>
        <div className="pt-1">
          <NumRow n={1} label="Join video conferencing and start transcribing" locked />
          <NumRow n={2} label="Meeting is being transcribed" defaultOn />
          <NumRow n={3} label="Meeting is being summarized" locked />
        </div>
      </Group>

      <Group title="Slack notifications">
        <Setting label="Slack notifications" desc="Get Slack notifications about activity in your Notion workspace" control={<Select value="Off" />} />
      </Group>

      <Group title="Discord notifications">
        <Setting label="Discord notifications" desc="Get Discord notifications about activity in your Notion workspace" control={<Select value="Off" />} />
      </Group>

      <Group title="Email notifications">
        <Setting label="Activity in my workspace" desc="Get emails about comments, mentions, page invites, reminders, access requests, and database property changes" control={<Toggle defaultOn />} />
        <Setting label="Always send email notifications" desc="Get emails about workspace activity even when you're active in Notion" control={<Toggle />} />
        <Setting label="Page updates" desc="Get email digests about pages you've turned on notifications for and pages you've created" control={<Toggle defaultOn />} />
        <Setting label="Workspace digest" desc="Get email digests about what's happening in your workspace" control={<Toggle defaultOn />} />
        <Setting label="Announcements and update emails" desc="Get occasional emails about new features from Notion" control={<Btn><ArrowUpRight className="mr-1 h-3.5 w-3.5" strokeWidth={1.9} />Manage settings</Btn>} />
      </Group>

      <div className="mt-8 flex items-center gap-1.5 text-[13px] text-[#9B9A97]">
        <CircleHelp className="h-3.5 w-3.5" strokeWidth={1.8} />
        Learn about notifications
      </div>
    </div>
  );
}

function AppIcon({ color, children }: { color: string; children?: React.ReactNode }) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-md text-[13px] font-semibold text-white" style={{ backgroundColor: color }}>
      {children}
    </span>
  );
}

function ConnectCard({ title, desc, icons }: { title: string; desc: string; icons: React.ReactNode }) {
  return (
    <div className="mt-4 flex overflow-hidden rounded-xl border border-black/[0.08] bg-[#FBFBFA]">
      {/* Left */}
      <div className="flex max-w-[360px] flex-col p-6">
        <div className="text-[16px] font-semibold text-[#2C2C2B]">{title}</div>
        <p className="mt-2 flex-1 text-[14px] leading-6 text-[#787774]">{desc}</p>
        <button onClick={() => toast(title)} className="mt-4 flex h-8 w-fit items-center rounded-md bg-[#2383E2] px-3 text-[14px] font-medium text-white hover:bg-[#1a73d0]">
          Get started
        </button>
      </div>
      {/* Right illustration */}
      <div className="relative flex-1 overflow-hidden">
        <div className="flex items-center gap-2 px-6 pt-7">{icons}</div>
        <div className="mx-6 mt-4 rounded-lg border border-black/[0.08] bg-white p-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-black text-[10px] font-bold text-white">N</span>
            <span className="text-[13px] font-medium text-[#2C2C2B]">Notion</span>
          </div>
          <div className="mt-2.5 space-y-2">
            <div className="h-2 w-3/4 rounded-full bg-black/[0.05]" />
            <div className="h-2 w-1/2 rounded-full bg-black/[0.05]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MailCalendarPane() {
  return (
    <div className="max-w-[860px]">
      <PaneHead title="Mail & Calendar" sub="Manage emails and calendars connected to your Notion account" />

      <div className="mt-9">
        <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Connected emails</h2>
        <p className="mt-1.5 text-[14px] leading-6 text-[#787774]">
          Add email threads to Notion databases, let Agents draft and organize messages, and more. Try it in{" "}
          <button onClick={() => toast("Notion Mail")} className="inline-flex items-center gap-0.5 font-medium text-[#2C2C2B] underline">Notion Mail<ArrowUpRight className="h-3 w-3" strokeWidth={2} /></button>
        </p>
        <ConnectCard
          title="Connect your email to Notion"
          desc="All your email context in one place. Search, draft, and ask questions with Notion AI or sync email messages into your databases."
          icons={<><AppIcon color="#EA4335">M</AppIcon><AppIcon color="#0078D4">O</AppIcon><span className="flex h-7 w-7 items-center justify-center rounded-md text-[#2C2C2B]"><Send className="h-4 w-4" strokeWidth={1.8} /></span></>}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Connected calendars</h2>
        <p className="mt-1.5 text-[14px] leading-6 text-[#787774]">
          Manage Notion databases in your calendar, let Agents schedule and take notes for your meetings, and more. Try it in{" "}
          <button onClick={() => toast("Notion Calendar")} className="inline-flex items-center gap-0.5 font-medium text-[#2C2C2B] underline">Notion Calendar<ArrowUpRight className="h-3 w-3" strokeWidth={2} /></button>
        </p>
        <ConnectCard
          title="Connect your calendar to Notion"
          desc="Manage all your time in one place. Coordinate meetings, optimize your schedule, and walk into every call prepared with Notion AI."
          icons={<>
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#4285F4] bg-white text-[10px] font-bold text-[#4285F4]">31</span>
            <AppIcon color="#0078D4">O</AppIcon>
            <AppIcon color="#000000"></AppIcon>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[18px]">📅</span>
          </>}
        />
      </div>
    </div>
  );
}

function StackedField({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-black/[0.06] py-3.5">
      <div className="text-[14px] font-medium text-[#2C2C2B]">{label}</div>
      <div className="mt-0.5 text-[13px] leading-5 text-[#9B9A97]">{desc}</div>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function LearnLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 pb-1 pt-3 text-[13px] text-[#9B9A97]">
      <CircleHelp className="h-3.5 w-3.5" strokeWidth={1.8} />
      {children}
    </div>
  );
}

function WorkspaceId() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between border-b border-black/[0.06] py-3.5">
      <div className="text-[14px] font-medium text-[#2C2C2B]">Workspace ID</div>
      <button onClick={() => { setCopied(true); toast("Copied workspace ID"); }} className="flex items-center gap-2 text-[13px] text-[#5F5E59] hover:text-[#2C2C2B]">
        5df4fa69-ff15-8181-b9b5-0003b401470c
        {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.8} />}
      </button>
    </div>
  );
}

export function GeneralPane() {
  const [wsName, setWsName] = usePersisted("notion-clone:workspace-name", "Alex Morgan's Space");
  const [domains, setDomains] = usePersisted("notion-clone:allowed-domains", "");
  return (
    <div className="max-w-[720px]">
      <PaneHead title="General" sub="Manage your workspace name, domains, and more" />

      <Group title="Workspace settings">
        <StackedField label="Workspace name" desc="Your workspace name can be up to 65 characters">
          <input value={wsName} onChange={(e) => setWsName(e.target.value)} maxLength={65} className="w-full rounded-md border border-black/[0.12] px-3 py-2 text-[14px] text-[#2C2C2B] outline-none focus:border-[#2383E2]" />
        </StackedField>
        <StackedField label="Icon" desc="Upload an image or pick an emoji. This icon will appear in your sidebar and notifications.">
          <button onClick={() => toast("Change icon")} className="flex h-[52px] w-[52px] items-center justify-center rounded-lg border border-black/[0.08] text-[26px] hover:bg-black/[0.03]">🏠</button>
        </StackedField>
        <Setting label="Custom landing page" desc="When a new member joins this workspace, this will be the first page they land on." control={<Select value="Select page" />} />
      </Group>

      <Group title="Sidebar">
        <Setting label="Show other Notion apps in sidebar" desc="Show Notion Calendar and Notion Mail in your sidebar" control={<Toggle />} />
      </Group>

      <Group title="Domain-based access">
        <StackedField label="Allowed email domains" desc="Anyone with email addresses at these domains can automatically join your workspace as a member">
          <input value={domains} onChange={(e) => setDomains(e.target.value)} placeholder="Type an email domain…" className="w-full rounded-md border border-black/[0.12] px-3 py-2 text-[14px] text-[#2C2C2B] outline-none focus:border-[#2383E2] placeholder:text-[#9B9A97]" />
        </StackedField>
        <div className="flex items-center justify-between py-3.5">
          <div className="min-w-0">
            <div className="text-[14px] font-medium text-[#2C2C2B]">Members</div>
            <div className="mt-0.5 text-[13px] text-[#9B9A97]">
              <button onClick={() => toast("Upgrade")} className="font-medium text-[#2383E2]">Upgrade</button> to get a list of members and guests in your workspace
            </div>
          </div>
          <Btn>Export</Btn>
        </div>
      </Group>

      <Group title="Analytics">
        <Setting label="Save and display page view analytics" desc="Collect page view data for all pages in Alex Morgan's Space. People with edit and full access to a page will be able to see how many views it has." control={<Toggle defaultOn />} />
        <LearnLine>Learn more</LearnLine>
      </Group>

      <Group title="People">
        <Setting label="People directory" desc="Enable the people directory and profile pages for this workspace" control={<Toggle defaultOn />} />
        <Setting label="Show recent activity on people profiles" desc="Show people's recently created and edited pages, along with their recent comments" control={<Toggle defaultOn />} />
        <Setting label="Hover cards" desc="Show people's profile information when you hover over their name" control={<Toggle defaultOn />} />
      </Group>

      <Group title="Danger zone">
        <Setting danger label="Delete workspace" desc="Permanently delete this workspace, including all pages and files." control={<Btn variant="danger">Delete workspace</Btn>} />
        <LearnLine>Learn about deleting workspaces.</LearnLine>
      </Group>

      <Group title="Workspace ID">
        <WorkspaceId />
      </Group>
    </div>
  );
}

const PEOPLE_TABS = [
  { id: "guests", label: "Guests", count: 0 },
  { id: "members", label: "Members", count: 1 },
  { id: "groups", label: "Groups", count: null },
  { id: "contacts", label: "Contacts", count: null },
] as const;

export function PeoplePane() {
  const [tab, setTab] = useState<(typeof PEOPLE_TABS)[number]["id"]>("members");
  const [linkOn, setLinkOn] = useState(true);

  return (
    <div className="max-w-[820px]">
      <h1 className="text-[26px] font-bold text-[#2C2C2B]">People</h1>
      <p className="mt-1.5 text-[14px] text-[#787774]">
        Manage people in your workspace and their roles{" "}
        <button onClick={() => toast("Learn more")} className="font-medium text-[#2383E2]">Learn more</button>
      </p>

      <div className="mt-6 flex justify-end">
        <button onClick={() => toast("View People Directory")} className="inline-flex items-center gap-0.5 text-[14px] text-[#5F5E59] hover:text-[#2C2C2B]">
          View People Directory<ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.9} />
        </button>
      </div>

      {/* Add members via link */}
      <div className="mt-2 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="text-[14px] font-medium text-[#2C2C2B]">Add members via link</div>
          <div className="mt-0.5 text-[13px] leading-5 text-[#9B9A97]">
            Only people with permission to invite members to this workspace can view this link. You can also <button onClick={() => toast("New link generated")} className="underline">generate a new link</button>.
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button onClick={() => toast("Copied link")} className="rounded-md bg-[#2383E2]/10 px-2.5 py-1.5 text-[14px] font-medium text-[#2383E2] hover:bg-[#2383E2]/15">Copy link</button>
          <button onClick={() => setLinkOn((v) => !v)} className={"relative h-[20px] w-[34px] rounded-full transition-colors " + (linkOn ? "bg-[#2383E2]" : "bg-black/[0.15]")} aria-label="Toggle link">
            <span className={"absolute top-[2px] h-4 w-4 rounded-full bg-white shadow transition-all " + (linkOn ? "left-[16px]" : "left-[2px]")} />
          </button>
        </div>
      </div>

      {/* Tabs + actions */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[14px]">
          {PEOPLE_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors " +
                (tab === t.id ? "bg-black/[0.05] font-medium text-[#2C2C2B]" : "text-[#787774] hover:bg-black/[0.03]")
              }
            >
              {t.label}
              {t.count !== null && <span className="text-[#9B9A97]">{t.count}</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast("Search")} className="flex h-8 w-8 items-center justify-center rounded-md text-[#5F5E59] hover:bg-black/[0.05]">
            <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
          <div className="flex h-8 items-stretch overflow-hidden rounded-md bg-[#2383E2] text-white">
            <button onClick={() => toast("Add members")} className="flex items-center px-3 text-[14px] font-medium hover:bg-[#1a73d0]">Add members</button>
            <button onClick={() => toast("Add options")} className="flex items-center border-l border-white/25 px-1.5 hover:bg-[#1a73d0]"><ChevronDown className="h-4 w-4" strokeWidth={2} /></button>
          </div>
        </div>
      </div>

      {/* Content */}
      {tab === "members" ? (
        <div className="mt-4">
          <div className="flex items-center border-b border-black/[0.06] pb-2 text-[13px] font-medium text-[#9B9A97]">
            <div className="flex flex-1 items-center gap-1">User <span>↑</span></div>
            <div className="w-[150px]">Teamspaces</div>
            <div className="w-[120px]">Groups</div>
            <div className="w-[160px]">Role</div>
          </div>
          <div className="flex items-center py-2.5">
            <div className="flex flex-1 items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E3E2E0] text-[13px] font-medium text-[#5F5E59]">A</span>
              <div className="min-w-0">
                <div className="truncate text-[14px] font-medium text-[#2C2C2B]">Alex Morgan</div>
                <div className="truncate text-[13px] text-[#9B9A97]">alex.morgan@example.com</div>
              </div>
            </div>
            <div className="w-[150px] text-[14px] text-[#9B9A97]">No access</div>
            <div className="w-[120px] text-[14px] text-[#9B9A97]">None</div>
            <div className="w-[160px]"><Select value="Workspace owner" /></div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-black/[0.12] py-24">
          <UserRoundPlus className="h-7 w-7 text-[#5F5E59]" strokeWidth={1.7} />
          <div className="mt-3 text-[14px] font-medium text-[#5F5E59]">No {tab} yet</div>
          <button onClick={() => toast("Import contacts")} className="mt-3 rounded-md border border-black/[0.12] px-3 py-1.5 text-[14px] font-medium text-[#2C2C2B] hover:bg-black/[0.03]">Import contacts</button>
        </div>
      )}
    </div>
  );
}

const FILE_IMPORTS = [
  { icon: <Table2 className="h-[18px] w-[18px] text-[#217346]" strokeWidth={1.8} />, title: "CSV", desc: "Import structured data from spreadsheets" },
  { icon: <FileText className="h-[18px] w-[18px] text-[#D93025]" strokeWidth={1.8} />, title: "PDF", desc: "Extract content from PDF documents" },
  { icon: <Type className="h-[18px] w-[18px] text-[#5F5E59]" strokeWidth={1.8} />, title: "Text & Markdown", desc: "Import plain text and formatted notes" },
  { icon: <Code2 className="h-[18px] w-[18px] text-[#5F5E59]" strokeWidth={1.8} />, title: "HTML", desc: "Import web pages and structured content" },
  { icon: <span className="flex h-[18px] w-[18px] items-center justify-center rounded bg-[#2B579A] text-[10px] font-bold text-white">W</span>, title: "Word", desc: "Bring your Word documents into Notion" },
];

const THIRDPARTY_IMPORTS = [
  { c: "#F06A6A", l: "A", title: "Asana", desc: "Migrate your projects and tasks" },
  { c: "#172B4D", l: "C", title: "Confluence", desc: "Transfer your team's documentation" },
  { c: "#0079BF", l: "T", title: "Trello", desc: "Move over your boards and cards" },
  { c: "#3299FE", l: "W", title: "Workflowy", desc: "Import your outlines and lists" },
  { c: "#00A82D", l: "E", title: "Evernote", desc: "Bring your notes and notebooks" },
  { c: "#0052CC", l: "J", title: "Jira", desc: "Import your issues and projects" },
  { c: "#FF3D57", l: "M", title: "Monday.com", desc: "Migrate your workspaces and tasks" },
  { c: "#F44F2B", l: "Q", title: "Quip", desc: "Import your collaborative documents" },
  { c: "#4285F4", l: "G", title: "Google Docs", desc: "Import your documents seamlessly" },
];

function ImportCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button onClick={() => toast(`Import from ${title}`)} className="flex flex-col rounded-lg border border-black/[0.08] p-3.5 text-left transition-colors hover:bg-black/[0.02]">
      <div className="flex items-center gap-2">
        <span className="flex h-[18px] w-[18px] items-center justify-center">{icon}</span>
        <span className="text-[14px] font-medium text-[#2C2C2B]">{title}</span>
      </div>
      <span className="mt-1.5 text-[13px] leading-5 text-[#9B9A97]">{desc}</span>
    </button>
  );
}

export function ImportPane() {
  const [tab, setTab] = useState<"discover" | "completed">("discover");

  return (
    <div className="max-w-[840px]">
      <h1 className="text-[26px] font-bold text-[#2C2C2B]">Import</h1>
      <p className="mt-1.5 text-[14px] text-[#787774]">
        Import data from other apps and files into Notion{" "}
        <button onClick={() => toast("Learn more")} className="font-medium text-[#2383E2]">Learn more</button>
      </p>

      {/* Tabs */}
      <div className="mt-5 flex items-center gap-1 text-[14px]">
        {(["discover", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={"rounded-md px-2.5 py-1 capitalize transition-colors " + (tab === t ? "bg-black/[0.05] font-medium text-[#2C2C2B]" : "text-[#787774] hover:bg-black/[0.03]")}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "completed" ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-black/[0.12] py-24 text-center">
          <Check className="h-7 w-7 text-[#B9B8B4]" strokeWidth={1.7} />
          <div className="mt-3 text-[14px] font-medium text-[#5F5E59]">No completed imports</div>
          <div className="mt-1 text-[13px] text-[#9B9A97]">Your finished imports will appear here.</div>
        </div>
      ) : (
        <>
          {/* Import your content */}
          <div className="mt-8">
            <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Import your content</h2>
            <p className="mt-1 text-[13px] text-[#9B9A97]">If you import a ZIP file, we&rsquo;ll convert each file inside into its own page</p>
            <button
              onClick={() => toast("Choose a file")}
              className="mt-4 flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#2383E2]/50 bg-[#2383E2]/[0.04] py-9"
            >
              <UploadCloud className="h-8 w-8 text-[#2383E2]/70" strokeWidth={1.6} />
              <div className="mt-2.5 text-[15px] font-semibold text-[#2C2C2B]">Import your content to Notion</div>
              <div className="mt-1 text-[13px] text-[#787774]">
                Drag and drop ZIP, CSV, PDF, text, markdown, or HTML files, or <span className="font-medium text-[#2383E2]">choose a file</span>
              </div>
              <div className="mt-2 text-[12px] text-[#9B9A97]">ZIP files can be a maximum of 5GB</div>
            </button>
          </div>

          {/* File-based imports */}
          <div className="mt-9">
            <h2 className="text-[15px] font-semibold text-[#2C2C2B]">File-based imports</h2>
            <p className="mt-1 text-[13px] text-[#9B9A97]">Import DOCX, CSV, PDF, text, markdown, HTML, or EPUB files to convert them to pages</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {FILE_IMPORTS.map((f) => <ImportCard key={f.title} {...f} />)}
            </div>
          </div>

          {/* Third-party imports */}
          <div className="mt-9">
            <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Third-party imports</h2>
            <p className="mt-1 text-[13px] text-[#9B9A97]">Migrate content from third-party apps</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {THIRDPARTY_IMPORTS.map((a) => (
                <ImportCard
                  key={a.title}
                  title={a.title}
                  desc={a.desc}
                  icon={<span className="flex h-[18px] w-[18px] items-center justify-center rounded text-[10px] font-bold text-white" style={{ backgroundColor: a.c }}>{a.l}</span>}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const AI_SKILLS = [
  { emoji: "✍️", name: "Improve writing" },
  { emoji: "✅", name: "Proofread" },
  { emoji: "💡", name: "Explain" },
  { emoji: "✨", name: "Reformat" },
];

function AiFaces() {
  return (
    <div className="flex items-center">
      {["", "🦆", "🔵"].map((acc, i) => (
        <span key={i} className={"relative flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#37352F] shadow-[0_1px_2px_rgba(0,0,0,0.05)] " + (i > 0 ? "-ml-2" : "")}>
          <NotionAiMark className="h-5 w-5" />
          {acc === "🦆" && <span className="absolute -top-2 text-[15px]">🦆</span>}
          {acc === "🔵" && <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-[#2383E2]" />}
        </span>
      ))}
    </div>
  );
}

export function NotionAiPane() {
  const [tab, setTab] = useState<"general" | "connectors" | "meetings">("general");

  return (
    <div className="max-w-[820px]">
      <h1 className="text-[26px] font-bold text-[#2C2C2B]">Notion AI</h1>
      <p className="mt-1.5 text-[14px] text-[#787774]">Choose how you want to use AI features and manage AI connectors</p>

      {/* Tabs */}
      <div className="mt-5 flex items-center gap-1 text-[14px]">
        {[
          { id: "general", label: "General" },
          { id: "connectors", label: "AI connectors" },
          { id: "meetings", label: "Meeting notes" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={"rounded-md px-2.5 py-1 transition-colors " + (tab === t.id ? "bg-black/[0.05] font-medium text-[#2C2C2B]" : "text-[#787774] hover:bg-black/[0.03]")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab !== "general" ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-black/[0.12] py-24 text-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F1F0ED] text-[#37352F]"><NotionAiMark className="h-4 w-4" /></span>
          <div className="mt-3 text-[14px] font-medium text-[#5F5E59]">{tab === "connectors" ? "No AI connectors" : "No meeting notes settings"}</div>
        </div>
      ) : (
        <>
          <Group title="Workspace settings">
            <div className="flex items-start justify-between gap-6 py-3.5">
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-[#2C2C2B]">Share data to improve Notion AI</div>
                <div className="mt-0.5 text-[13px] leading-5 text-[#9B9A97]">
                  Help improve Notion AI by allowing data from this workspace to be shared with Notion. By enabling the Learning and Early Access Program you are agreeing to the <span className="underline">LEAP Terms</span>.{" "}
                  <button onClick={() => toast("Learn more")} className="underline">Learn more</button>
                </div>
              </div>
              <Toggle />
            </div>
          </Group>

          <div className="mt-9 flex items-start justify-between gap-6">
            <div>
              <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Personalization</h2>
              <p className="mt-1 text-[13px] text-[#9B9A97]">Pick a name and an accessory for your Notion AI</p>
              <button onClick={() => toast("Personalize")} className="mt-3 flex h-8 items-center gap-1.5 rounded-md border border-black/[0.12] px-3 text-[14px] font-medium text-[#2C2C2B] hover:bg-black/[0.03]">
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />Personalize
              </button>
            </div>
            <AiFaces />
          </div>

          <div className="mt-9">
            <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Instructions</h2>
            <p className="mt-1 text-[13px] text-[#9B9A97]">Instructions allow you to customize how your Agent works and interacts with you</p>
            <button onClick={() => toast("Add instructions")} className="mt-3 flex h-8 items-center gap-1.5 rounded-md border border-black/[0.12] px-3 text-[14px] font-medium text-[#2C2C2B] hover:bg-black/[0.03]">
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />Add instructions
            </button>
          </div>

          <div className="mt-9">
            <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Skills</h2>
            <p className="mt-1 text-[13px] leading-5 text-[#9B9A97]">
              Skills are common tasks that AI can complete. Use them by @-mentioning the skill&rsquo;s name in a chat with Agent, or via the menu that appears when you select text in a page. <button onClick={() => toast("Learn more")} className="underline">Learn more</button>
            </p>
            <button onClick={() => toast("Add a skill")} className="mt-3 flex h-8 items-center gap-1.5 rounded-md bg-black/[0.05] px-3 text-[14px] font-medium text-[#2C2C2B] hover:bg-black/[0.08]">
              <Plus className="h-4 w-4" strokeWidth={2} />Add a skill
            </button>
            <div className="mt-4 text-[12px] font-medium text-[#9B9A97]">Created by me</div>
            <div className="mt-1">
              {AI_SKILLS.map((s) => (
                <div key={s.name} className="flex items-center gap-2.5 border-b border-black/[0.06] py-2.5">
                  <span className="text-[15px]">{s.emoji}</span>
                  <span className="flex-1 text-[14px] text-[#2C2C2B]">{s.name}</span>
                  <span className="rounded bg-[#EAF3FB] px-1.5 py-0.5 text-[11px] font-semibold text-[#2383E2]">AI</span>
                  <button onClick={() => toast(`Open ${s.name}`)} className="rounded-md border border-black/[0.12] px-2 py-1 text-[13px] font-medium text-[#2C2C2B] hover:bg-black/[0.03]">Open page</button>
                </div>
              ))}
            </div>
          </div>

          <Group title="Restricted access models">
            <p className="pt-1 text-[13px] leading-5 text-[#9B9A97]">
              Your workspace admin may enable the below optional LLMs which may retain your data. <button onClick={() => toast("See here")} className="underline">See here</button> for more information.
            </p>
            <Setting label="☀️ Fable 5" control={<Toggle />} />
          </Group>
        </>
      )}
    </div>
  );
}

const CONNECTIONS = [
  { c: "#4285F4", l: "31", n: "Google Calendar" },
  { c: "#4B53BC", l: "T", n: "Microsoft Teams" },
  { c: "#0078D4", l: "O", n: "Outlook" },
  { c: "#00A1E0", l: "S", n: "Salesforce" },
  { c: "#F06A6A", l: "A", n: "Asana" },
  { c: "#0061D5", l: "B", n: "Box" },
  { c: "#000000", l: "G", n: "GitHub" },
  { c: "#EA4335", l: "M", n: "Gmail" },
  { c: "#1FA463", l: "D", n: "Google Drive" },
  { c: "#0052CC", l: "J", n: "Jira" },
  { c: "#5E6AD2", l: "L", n: "Linear" },
  { c: "#038387", l: "S", n: "SharePoint & OneDrive" },
  { c: "#4A154B", l: "S", n: "Slack" },
  { c: "#1E61F0", l: "A", n: "Amplitude" },
  { c: "#000000", l: "A", n: "Attio" },
];

export function ConnectionsPane() {
  const [tab, setTab] = useState<"discover" | "installed" | "manage">("discover");

  return (
    <div className="max-w-[840px]">
      <h1 className="text-[26px] font-bold text-[#2C2C2B]">Connections</h1>
      <p className="mt-1.5 text-[14px] text-[#787774]">Browse and manage the apps you use with Notion</p>

      {/* Tabs + developer portal */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[14px]">
          {[
            { id: "discover", label: "Discover" },
            { id: "installed", label: "Installed" },
            { id: "manage", label: "Manage" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={"rounded-md px-2.5 py-1 transition-colors " + (tab === t.id ? "bg-black/[0.05] font-medium text-[#2C2C2B]" : "text-[#787774] hover:bg-black/[0.03]")}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={() => toast("Developer portal")} className="inline-flex items-center gap-0.5 text-[14px] text-[#5F5E59] hover:text-[#2C2C2B]">
          Go to developer portal<ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.9} />
        </button>
      </div>

      {tab !== "discover" ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-black/[0.12] py-24 text-center text-[14px] text-[#9B9A97]">
          No {tab} connections yet
        </div>
      ) : (
        <>
          <div className="mt-7">
            <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Discover connections</h2>
            <p className="mt-1 text-[13px] text-[#9B9A97]">Explore available connections for your workspace</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button onClick={() => toast("Filter by type")} className="flex h-8 items-center gap-1.5 rounded-md px-2 text-[14px] text-[#5F5E59] hover:bg-black/[0.04]">
              <Table2 className="h-4 w-4" strokeWidth={1.8} />Type<ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <button onClick={() => toast("Search")} className="flex h-8 w-8 items-center justify-center rounded-md text-[#5F5E59] hover:bg-black/[0.05]">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            {CONNECTIONS.map((a) => (
              <button key={a.n} onClick={() => toast(a.n)} className="flex items-center gap-3 rounded-xl border border-black/[0.08] px-4 py-4 text-left transition-colors hover:bg-black/[0.02]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[12px] font-bold text-white" style={{ backgroundColor: a.c }}>{a.l}</span>
                <span className="truncate text-[14px] font-medium text-[#2C2C2B]">{a.n}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const MCP_APPS = [
  { c: "#10A37F", l: "G", n: "ChatGPT" },
  { c: "#D97757", l: "C", n: "Claude" },
  { c: "#000000", l: "C", n: "Composio" },
  { c: "#000000", l: "C", n: "Cursor" },
  { c: "#4A6CF7", l: "D", n: "Devin" },
  { c: "#F24E1E", l: "F", n: "Figma" },
  { c: "#000000", l: "G", n: "GitHub" },
  { c: "#FF7A59", l: "H", n: "HubSpot" },
  { c: "#6D00CC", l: "M", n: "Make" },
  { c: "#FF7000", l: "M", n: "Mistral" },
  { c: "#000000", l: "P", n: "Poke" },
  { c: "#007ACC", l: "V", n: "VS Code" },
  { c: "#FF4A00", l: "Z", n: "Zapier" },
  { c: "#9B9A97", l: "✦", n: "Other AI tools" },
];

export function McpPane() {
  const [tab, setTab] = useState<"discover" | "manage">("discover");

  return (
    <div className="max-w-[840px]">
      <h1 className="text-[26px] font-bold text-[#2C2C2B]">Notion MCP</h1>
      <p className="mt-1.5 text-[14px] text-[#787774]">
        Add your favorite apps and tools to Notion{" "}
        <button onClick={() => toast("Learn more")} className="font-medium text-[#2383E2]">Learn more</button>
      </p>

      {/* Tabs */}
      <div className="mt-5 flex items-center gap-1 text-[14px]">
        {[
          { id: "discover", label: "Discover" },
          { id: "manage", label: "Manage" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={"rounded-md px-2.5 py-1 transition-colors " + (tab === t.id ? "bg-black/[0.05] font-medium text-[#2C2C2B]" : "text-[#787774] hover:bg-black/[0.03]")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "manage" ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-black/[0.12] py-24 text-center text-[14px] text-[#9B9A97]">
          No connected MCP clients yet
        </div>
      ) : (
        <>
          <div className="mt-7">
            <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Discover external AI apps</h2>
            <p className="mt-1 text-[13px] text-[#9B9A97]">These MCP clients support connecting to the Notion MCP</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {MCP_APPS.map((a) => (
              <button key={a.n} onClick={() => toast(a.n)} className="flex items-center gap-3 rounded-xl border border-black/[0.08] px-4 py-4 text-left transition-colors hover:bg-black/[0.02]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[12px] font-bold text-white" style={{ backgroundColor: a.c }}>{a.l}</span>
                <span className="truncate text-[14px] font-medium text-[#2C2C2B]">{a.n}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PublicStat({ label, sub }: { label: string; sub: string }) {
  return (
    <button onClick={() => toast(label)} className="flex flex-col rounded-xl border border-black/[0.08] p-4 text-left transition-colors hover:bg-black/[0.02]">
      <div className="text-[13px] text-[#787774]">{label}</div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[28px] font-bold leading-none text-[#2C2C2B]">0</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.04] text-[#9B9A97]"><ChevronRight className="h-4 w-4" strokeWidth={2} /></span>
      </div>
      <div className="mt-2 text-[13px] text-[#9B9A97]">{sub}</div>
    </button>
  );
}

export function PublicPagesPane() {
  return (
    <div className="max-w-[840px]">
      <PaneHead title="Public pages" sub="Manage public content from your workspace" />

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <PublicStat label="Notion Sites" sub="No published sites" />
        <PublicStat label="Public forms" sub="No public forms" />
        <PublicStat label="Anyone with the link" sub="No public share links" />
        <PublicStat label="Shared AI chats" sub="No shared chats" />
      </div>

      {/* Domains */}
      <div className="mt-9">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Domains</h2>
            <p className="mt-1 text-[13px] text-[#9B9A97]">
              You can publish Notion Sites on this domain. <button onClick={() => toast("Upgrade")} className="font-medium text-[#2383E2]">Upgrade</button> for multiple domains
            </p>
          </div>
          <button onClick={() => toast("New domain")} className="flex h-8 items-center rounded-md border border-black/[0.12] px-3 text-[14px] font-medium text-[#9B9A97]">New domain</button>
        </div>
        <div className="mt-3 flex items-center border-b border-black/[0.06] pb-2 text-[13px] font-medium text-[#9B9A97]">
          <div className="flex-1">Domain</div>
          <div className="w-[220px]">Homepage</div>
          <div className="w-[120px]">Status</div>
          <div className="w-8" />
        </div>
        <div className="flex items-center py-3 text-[14px]">
          <div className="flex flex-1 items-center gap-1.5">
            <span className="rounded bg-black/[0.04] px-1.5 py-0.5 text-[13px] text-[#2C2C2B]">alex-morgan-002.notion.site</span>
            <span className="text-[#C6C4C0]">⚐</span>
          </div>
          <div className="w-[220px] text-[13px]">
            <button onClick={() => toast("Upgrade to Business")} className="font-medium text-[#2383E2]">Upgrade</button> <span className="text-[#9B9A97]">to Business</span>
          </div>
          <div className="w-[120px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F5EC] px-2 py-0.5 text-[13px] text-[#2A7E4F]"><span className="h-1.5 w-1.5 rounded-full bg-[#2A7E4F]" />Live</span>
          </div>
          <button onClick={() => toast("Domain options")} className="flex h-7 w-7 items-center justify-center rounded-md text-[#9B9A97] hover:bg-black/[0.05]"><MoreHorizontal className="h-4 w-4" strokeWidth={1.8} /></button>
        </div>
      </div>

      {/* Settings */}
      <Group title="Settings">
        <Setting label="Always indicate that a page is live as a Notion Site" desc="A banner will appear at the top of pages to indicate they have been published as a Notion Site" control={<Toggle defaultOn />} />
      </Group>
    </div>
  );
}

export function EmojiPane() {
  return (
    <div className="max-w-[720px]">
      <PaneHead title="Emoji" sub="See all workspace emojis and add new ones" />
      <div className="mt-6">
        <Setting label="Limit custom emoji creation to workspace owners" desc="Any existing emojis can still be edited or deleted by the person who added them" control={<Toggle />} />
      </div>
      <div className="mt-24 flex flex-col items-center justify-center text-center">
        <Smile className="h-10 w-10 text-[#C6C4C0]" strokeWidth={1.5} />
        <div className="mt-3 max-w-[280px] text-[14px] leading-6 text-[#787774]">This workspace doesn&rsquo;t have any custom emojis yet. Add your first emoji to get started.</div>
        <button onClick={() => toast("Add emoji")} className="mt-4 rounded-md border border-black/[0.12] px-3 py-1.5 text-[14px] font-medium text-[#2C2C2B] hover:bg-black/[0.03]">Add emoji</button>
      </div>
    </div>
  );
}

function FilterPill({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button onClick={() => toast(label)} className={"flex h-7 items-center gap-1.5 rounded-md px-2 text-[14px] transition-colors " + (active ? "bg-[#2383E2]/10 text-[#2383E2]" : "text-[#5F5E59] hover:bg-black/[0.04]")}>
      <span className={active ? "text-[#2383E2]" : "text-[#8A8985]"}>{icon}</span>
      {label}
      <ChevronDown className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
    </button>
  );
}

export function TeamspacesPane() {
  return (
    <div className="max-w-[840px]">
      <h1 className="text-[26px] font-bold text-[#2C2C2B]">Teamspaces</h1>
      <p className="mt-1.5 text-[14px] text-[#787774]">
        Manage teamspaces in this workspace{" "}
        <button onClick={() => toast("Learn more")} className="font-medium text-[#2383E2]">Learn more</button>
      </p>

      <div className="mt-6">
        <Setting label="Limit teamspace creation to workspace owners" desc="Allow only workspace owners to create teamspaces" control={<Toggle />} />
      </div>

      <div className="mt-8">
        <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Teamspaces</h2>
        <p className="mt-1 text-[13px] text-[#9B9A97]">Manage all teamspaces you have access to here</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FilterPill icon={<Table2 className="h-4 w-4" strokeWidth={1.8} />} label="Active" />
            <FilterPill icon={<UserRoundPlus className="h-4 w-4" strokeWidth={1.8} />} label="Owner" active />
            <FilterPill icon={<CircleHelp className="h-4 w-4" strokeWidth={1.8} />} label="Access" />
            <FilterPill icon={<Lock className="h-4 w-4" strokeWidth={1.8} />} label="Security" />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toast("Search")} className="flex h-8 w-8 items-center justify-center rounded-md text-[#5F5E59] hover:bg-black/[0.05]"><Search className="h-[18px] w-[18px]" strokeWidth={1.8} /></button>
            <Btn variant="blue" onClick={() => toast("New teamspace")}>New teamspace</Btn>
          </div>
        </div>

        <div className="mt-3 flex items-center border-b border-black/[0.06] pb-2 text-[13px] font-medium text-[#9B9A97]">
          <div className="flex-1">Teamspace</div>
          <div className="w-[200px]">Owners</div>
          <div className="w-[140px]">Access</div>
          <div className="flex w-[140px] items-center gap-1">Updated <span>↓</span></div>
        </div>
        <div className="py-10 text-center text-[14px] text-[#9B9A97]">Could not find any teamspaces.</div>
      </div>
    </div>
  );
}

const FREE_FEATS = ["Basic forms", "Basic sites", "Basic automations", "Custom databases", "Notion Calendar", "Notion Mail"];
const BUSINESS_FEATS = ["Custom Agents", "AI Meeting Notes", "Search across tools with AI", "Page verification & archive", "Custom Notion Sites and forms", "SAML SSO", "AI Workers that run custom code on Notion"];
const ENTERPRISE_FEATS = ["AI analytics & controls", "Zero data retention with LLM providers", "SCIM user provisioning", "Advanced security & controls", "Audit log", "Security & Compliance integrations (DLP, SIEM)", "Domain management", "Advanced integrations"];

function AiFacesCluster() {
  return (
    <div className="flex items-center">
      {["⏰", "😀", "🐤"].map((e, i) => (
        <span
          key={i}
          className={
            "flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-white text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.15)] " +
            (i > 0 ? "-ml-2" : "")
          }
        >
          {e}
        </span>
      ))}
    </div>
  );
}

function FeatList({ title, items, faces }: { title: string; items: string[]; faces?: boolean }) {
  return (
    <div className="px-4 pt-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-[#2C2C2B]">{title}</span>
        {faces && <AiFacesCluster />}
      </div>
      <ul className="space-y-2.5 text-[13px] text-[#37352F]">
        {items.map((f) => (
          <li key={f} className="flex items-start gap-1.5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2C2C2B]" strokeWidth={2.2} />{f}</li>
        ))}
      </ul>
    </div>
  );
}

export function UpgradePane() {
  return (
    <div className="max-w-[900px]">
      <h1 className="text-[26px] font-bold text-[#2C2C2B]">Explore plans</h1>
      <p className="mt-1.5 text-[14px] text-[#787774]">Compare all Notion plans</p>

      {/* Your current plan */}
      <div className="mt-7">
        <h2 className="text-[15px] font-semibold text-[#2C2C2B]">Your current plan</h2>
        <div className="mt-3 flex items-center justify-between gap-6 rounded-xl border border-black/[0.08] p-6">
          <div>
            <div className="text-[22px] font-bold text-[#2C2C2B]">Free</div>
            <div className="mt-1 text-[14px] text-[#787774]">For organizing every corner of your work and life</div>
            <div className="mt-2 flex items-center gap-1 text-[13px] text-[#9B9A97]">Unlimited blocks <CircleHelp className="h-3.5 w-3.5" strokeWidth={1.8} /></div>
          </div>
          <div className="flex max-w-[340px] items-center gap-3 rounded-lg bg-black/[0.03] p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1F0ED] text-[#37352F]"><NotionAiMark className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1 text-[13px] text-[#5F5E59]"><span className="font-medium text-[#2C2C2B]">Notion AI</span><br />Upgrade to search everywhere, automate meeting notes & more</div>
            <Btn variant="blue" onClick={() => toast("Upgrade")}>Upgrade</Btn>
          </div>
        </div>
      </div>

      {/* Compare all plans */}
      <div className="mt-9">
        <div className="flex items-center gap-1 text-[15px] font-semibold text-[#2C2C2B]">Compare all plans <CircleHelp className="h-3.5 w-3.5 text-[#9B9A97]" strokeWidth={1.8} /></div>

        {/* Plan heads */}
        <div className="mt-4 grid grid-cols-[110px_repeat(3,1fr)] border-b border-black/[0.06] pb-5">
          <div />
          <div className="px-4">
            <div className="text-[18px] font-bold text-[#2C2C2B]">Free</div>
            <div className="mt-2 text-[13px] text-[#787774]">$0 per member / month</div>
          </div>
          <div className="px-4">
            <div className="flex items-center gap-2"><span className="text-[18px] font-bold text-[#2C2C2B]">Business</span><span className="rounded bg-[#EAF3FB] px-1.5 py-0.5 text-[11px] font-medium text-[#2383E2]">Popular</span></div>
            <div className="mt-2 text-[13px] text-[#787774]">$20 per member / month<br />billed annually</div>
            <div className="text-[12px] text-[#9B9A97]">$24 billed monthly</div>
            <button onClick={() => toast("Upgrade to Business")} className="mt-3 flex h-8 w-fit items-center rounded-md bg-[#2383E2] px-4 text-[14px] font-medium text-white hover:bg-[#1a73d0]">Upgrade</button>
          </div>
          <div className="px-4">
            <div className="flex items-center gap-2"><span className="text-[18px] font-bold text-[#2C2C2B]">Enterprise</span><span className="rounded bg-black/[0.05] px-1.5 py-0.5 text-[11px] font-medium text-[#5F5E59]">Limited</span></div>
            <div className="mt-2 text-[13px] text-[#787774]">$26 per member / month<br />billed annually</div>
            <div className="text-[12px] text-[#9B9A97]">$32 billed monthly</div>
            <button onClick={() => toast("Upgrade to Enterprise")} className="mt-3 flex h-8 w-fit items-center rounded-md border border-black/[0.12] px-4 text-[14px] font-medium text-[#2C2C2B] hover:bg-black/[0.03]">Upgrade</button>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-[110px_repeat(3,1fr)] rounded-b-lg bg-black/[0.015]">
          <div className="px-4 pt-4 text-[13px] font-medium text-[#787774]">Highlights</div>
          <FeatList title="Includes" items={FREE_FEATS} />
          <FeatList title="Everything in Free" items={BUSINESS_FEATS} faces />
          <FeatList title="Everything in Business" items={ENTERPRISE_FEATS} />
        </div>
      </div>
    </div>
  );
}
