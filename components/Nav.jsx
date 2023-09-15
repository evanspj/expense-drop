import Link from 'next/link';
import { useRouter } from 'next/router';

import Menu from '@components/Menu';
import Tooltip from '@components/Tooltip';

export default function Nav() {
  const router = useRouter();

  return (
    <nav className="print:hidden w-full h-[63px] fixed top-0 left-0 right-0  bg-gray-100 z-40">
      <div className="h-full max-w-screen-3xl flex items-center justify-between px-4 mx-auto">
        <div className="flex items-center space-x-6 w-1/2">
          {router.pathname !== '/app' ? (
            <div className="flex items-center">
              <Tooltip label="Back to Dashboard" dark>
                <Link href="/app" className="bg-white border border-gray-200 hover:bg-black hover:text-white rounded-md p-2">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                </Link>
              </Tooltip>
            </div>
          ) : null}
        </div>
        <div className="w-1/2 flex justify-end space-x-3">
          <Menu />
        </div>
      </div>
    </nav>
  );
}
