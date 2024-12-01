import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Heart, Star, CloudRain, Cat, TreePine } from 'lucide-react';
import GumiFeedingMinigame from './GumiFeedingMinigame';
import MedicationMinigame from './MedicationMinigame'; 

import bedroomImage from '/src/assets/bedroom.png';
import doorImage from '/src/assets/door.png';
import dead1Image from '/src/assets/dead1.png';
import dead2Image from '/src/assets/dead2.png';
import dead3Image from '/src/assets/dead3.png';
import dead4Image from '/src/assets/dead4.png';
import dead5Image from '/src/assets/dead5.png';
import titleImage from '/src/assets/title.png';
import flowersImage from '/src/assets/flowers.png';
import bedroomflowersImage from '/src/assets/bedroomflowers.png';
import redImage from '/src/assets/red.png';
import blueImage from '/src/assets/blue.png';
import yellowImage from '/src/assets/yellow.png';
import healedforestImage from '/src/assets/healedforest.png';



const BloomGame = () => {
    const [showFeedingMinigame, setShowFeedingMinigame] = useState(false);
    const [showMedicationMinigame, setShowMedicationMinigame] = useState(false);
    const [showDoorScene, setShowDoorScene] = useState(false);
    const [deadImageIndex, setDeadImageIndex] = useState(0);

    const [gameStarted, setGameStarted] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [nameEntered, setNameEntered] = useState(false);
    const [currentScene, setCurrentScene] = useState('bedroom');
    const [inventory, setInventory] = useState([]);
    const [gameState, setGameState] = useState({
      fedCat: false,
      tookMedicine: false,
      triedFlowers: false,
      triedMusic: false,
      triedPuzzle: false,
      forestHealth: 0,
    });

    const [viewedFlowers, setViewedFlowers] = useState({
        red: false,
        blue: false,
        yellow: false
      });

    const handleKeyPress = (e) => {
        if (e.key.toLowerCase() === 'x') {
          // Get all possible next scenes from current choices
          const nextScenes = currentSceneData?.choices
            ?.filter(choice => !choice.hidden)
            .map(choice => choice.nextScene)
            .filter(scene => scene);
      
          // If there's a next scene available, go to it
          if (nextScenes && nextScenes.length > 0) {
            const nextScene = nextScenes[0];
            setTransitioning(true);
            setOpacity(0);
            
            setTimeout(() => {
              setCurrentScene(nextScene);
              setTimeout(() => {
                setOpacity(1);
                setTransitioning(false);
              }, 50);
            }, 300);
          }
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentScene]);
        
  
    const GameContainer = ({ children }) => (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '1100px', margin: '0 auto' }}>
          <div className="h-[650px] relative overflow-hidden bg-gray-200">
            {children}
          </div>
        </div>
      </div>
    );
  
    const completeTask = (task) => {
      setGameState(prev => ({
        ...prev,
        [task]: true
      }));
    };
  
    const updateForestHealth = (flowerType) => {
      setGameState(prev => ({
        ...prev,
        forestHealth: Math.min(100, prev.forestHealth + 34)
      }));
    };
  
    const isInForest = (scene) => {
      const forestScenes = ['forest_entry', 'meet_sadness', 'sadness_explain', 
                           'sadness_reject_flowers', 'sadness_reject_music', 
                           'sadness_accept', 'meet_misfit', 'misfit_explain', 
                           'misfit_reject', 'misfit_accept', 'meet_love',
                           'love_options', 'love_reject', 'love_minigame',
                           'love_revelation', 'healed_forest'];
      return forestScenes.includes(scene);
    };
   
      
    const processText = (text) => {
      return text.replace('[name]', playerName);
    };
  



    const scenes = {
        bedroom: {
            image: (gameState.fedCat && gameState.tookMedicine) 
              ? `url(${doorImage})`
              : `url(${bedroomImage})`,
            text: (gameState.fedCat && gameState.tookMedicine)
              ? "You hear peculiar sounds coming from outside your door."
              : "Good morning [name]!",
            choices: [
              { 
                text: "Feed Gumi", 
                action: () => setShowFeedingMinigame(true),
                hidden: gameState.fedCat
              },
              { 
                text: "Take medication", 
                action: () => setShowMedicationMinigame(true),
                hidden: gameState.tookMedicine
              },
              { 
                text: "Open door",
                action: () => {
                  // Start with first image
                  setCurrentScene('dead_sequence');
                  setDeadImageIndex(0);
                  
                  // Schedule the sequence of images
                  setTimeout(() => setDeadImageIndex(1), 400);
                  setTimeout(() => setDeadImageIndex(2), 800);
                  setTimeout(() => setDeadImageIndex(3), 1200);
                  setTimeout(() => {
                    setCurrentScene('forest_entry');
                  }, 1600);
                },
                hidden: !gameState.fedCat || !gameState.tookMedicine,
              }
            ]
          },
    
          
      dead_sequence: {
        image: `url(${
            deadImageIndex === 0 ? dead1Image :
            deadImageIndex === 1 ? dead2Image :
            deadImageIndex === 2 ? dead3Image :
            dead4Image
        })`,
        text: "",
        choices: [],
    },


      forest_entry: {
        image: `url(${dead5Image})`,
        text: "'[name], the forest needs your help. Plants are withering and we don't know why.' A distant voice echoes.",
        choices: [
          { 
            text: "Enter the forest", 
            action: () => setCurrentScene('meet_sadness')
          }
        ]
      },


      meet_sadness: {
        image: "Blue Spirit under Willow Tree",
        text: "You encounter a spirit of Sadness, weeping beneath a willow tree. Dark blue tears fall from its ethereal form.",
        choices: [
          { text: "Why are you crying? What's wrong?", nextScene: "sadness_explain" }
        ]
      },
      sadness_explain: {
        image: "Blue Spirit Conversation",
        text: "'I cry because it is what I do. I cry because I am sadness, and sadness is part of this forest.'",
        choices: [
          { 
            text: "Bring flowers",
            action: () => completeTask('triedFlowers'),
            nextScene: "sadness_reject_flowers",
            hidden: gameState.triedFlowers
          },
          { 
            text: "Play music with Gumi's violin",
            action: () => completeTask('triedMusic'),
            nextScene: "sadness_reject_music",
            hidden: gameState.triedMusic
          },
          {
            text: "Sit quietly with the spirit",
            nextScene: "sadness_accept",
            hidden: !gameState.triedFlowers && !gameState.triedMusic,
            requirementText: "Try other approaches first"
          }
        ]
      },
      sadness_reject_flowers: {
        image: "Wilted Flowers Scene",
        text: "The flowers wilt immediately. Your attempt to cheer up the spirit seems to make it withdraw further.",
        choices: [
          { text: "Try something else", nextScene: "sadness_explain" }
        ]
      },
      sadness_reject_music: {
        image: "Failed Music Scene",
        text: "The notes fall flat, and the spirit continues to sob. Perhaps there's another way...",
        choices: [
          { text: "Try something else", nextScene: "sadness_explain" }
        ]
      },
      sadness_accept: {
        image: "Accepting Sadness Scene",
        text: "'You're not something to fix, are you? You're just here, and that's okay.'\n\n'You understand me.'\n\n'I think I do.'",
        choices: [
          { 
            text: "Take the blue flower",
            nextScene: "meet_misfit",
            action: () => {
              setInventory([...inventory, "blue flower"]);
              updateForestHealth("blue");
            }
          }
        ]
      },
      meet_misfit: {
        image: "Yellow Star Spirit",
        text: "You encounter a peculiar spirit that seems out of place, trying to blend in with the forest but standing out in its unique way.",
        choices: [
          { text: "Why are you sitting here all alone?", nextScene: "misfit_explain" }
        ]
      },
      misfit_explain: {
        image: "Misfit Spirit Scene",
        text: "'I don't belong here. They all fit together perfectly, like pieces of a puzzle. But me? I'm the wrong shape, no matter how hard I try.\n\nIf you want to help, maybe you can figure out how I'm supposed to fit.'",
        choices: [
          { 
            text: "Try to fit the spirit into the pattern",
            action: () => completeTask('triedPuzzle'),
            nextScene: "misfit_reject",
            hidden: gameState.triedPuzzle
          },
          {
            text: "Maybe you're not supposed to fit into their puzzle",
            nextScene: "misfit_accept",
            hidden: !gameState.triedPuzzle,
            requirementText: "Try helping them fit in first"
          }
        ]
      },
      misfit_reject: {
        image: "Failed Puzzle Scene",
        text: "'You're wasting your time. I'll never belong.' The spirit cries.",
        choices: [
          { text: "Try a different approach", nextScene: "misfit_explain" }
        ]
      },
      misfit_accept: {
        image: "Glowing Misfit Scene",
        text: "'Maybe you're your own piece. You belong wherever you choose to be. Maybe your shape is different, but that doesn't mean it's wrong. It just means you're meant for something else.'\n\nThe Misfit Spirit slowly stands, and starts glowing. It makes the rest of the pieces start glowing, too.",
        choices: [
          { 
            text: "Take the yellow flower",
            nextScene: "meet_love",
            action: () => {
              setInventory([...inventory, "yellow flower"]);
              updateForestHealth("yellow");
            }
          }
        ]
      },
      meet_love: {
        image: "Love Spirit Scene",
        text: "A red spirit surrounded by vines with berries and thorns appears before you.\n\n'I've been stuck here for so long. I don't know what I did to deserve this.'",
        choices: [
          { text: "Try to help", nextScene: "love_options" }
        ]
      },
      love_options: {
        image: "Love Spirit with Vines",
        text: "The spirit seems trapped by thorny vines with glowing berries.",
        choices: [
          { text: "Tug on vines", nextScene: "love_reject" },
          { text: "Use Gumi's scissors to cut branch and eat a berry", nextScene: "love_minigame" }
        ]
      },
      love_reject: {
        image: "Tightening Vines",
        text: "The vines grow thicker and tighter.",
        choices: [
          { text: "Try something else", nextScene: "love_options" }
        ]
      },
      love_minigame: {
        image: "Space Void Scene",
        text: "The world dissolves into a realistic void in space. Aliens fly towards you.\n\n'The aliens are going to get us!'",
        choices: [
          { text: "Return to reality", nextScene: "love_revelation" }
        ]
      },
      love_revelation: {
        image: "Healing Scene",
        text: "'People are allowed to worry about me. I am worthy of love'\n\nVines slowly disappear and the red flower in the center blooms.",
        choices: [
          { 
            text: "Take the red flower",
            nextScene: "healed_forest",
            action: () => {
              setInventory([...inventory, "red flower"]);
              updateForestHealth("red");
            }
          }
        ]
      },

      healed_forest: {
        image: `url(${healedforestImage})`,
        text: "You look back, and the forest is transformed—vibrant, alive, and healed.",
        choices: [
            { text: "Go back home", nextScene: "ending" }
          ]
      },

      ending: {
        image: `url(${bedroomflowersImage})`, 
        text: "'Was this all a dream?'",
        choices: [
          { text: "Click on the flowers", nextScene: "final_thoughts" }
        ]
      },
      final_thoughts: {
        image: `url(${flowersImage})`,
        text: "'Maybe not.'",
        renderCustomContent: true,
        choices: [], // Remove default choices since we'll use custom boxes
      },

      endgame: {
        image: `url(${flowersImage})`,
        text: "",
        choices: [
          { text: "End", nextScene: "credits" }
        ]
      },
      
      red: {
        image: `url(${redImage})`,
        text: "Love was never something I had to prove—it was something I always carried. And now, I see the beauty in letting it bloom, both for others and myself.",
        choices: [], // Remove the "Return to flowers" choice
        onEnter: () => setViewedFlowers(prev => ({ ...prev, red: true }))
    },
    yellow: {
        image: `url(${yellowImage})`,
        text: "I'm different from others. But that just means I have more to offer to the world.",
        choices: [], // Remove the "Return to flowers" choice
        onEnter: () => setViewedFlowers(prev => ({ ...prev, yellow: true }))
    },
    blue: {
        image: `url(${blueImage})`,
        text: "Sadness is a part of me, but it doesn't define me. It makes the love I feel stronger.",
        choices: [], // Remove the "Return to flowers" choice
        onEnter: () => setViewedFlowers(prev => ({ ...prev, blue: true }))
    },




      credits: {
        image: `url(${titleImage})`,
        text: "",
        renderCustomContent: true,
        choices: []
      }
    };
  
    const handleNameSubmit = (e) => {
      e.preventDefault();
      if (playerName.trim()) {
        setNameEntered(true);
      }
    };
  
    const handleChoice = (choice) => {
        if (choice.action) {
            choice.action();
        }
        if (choice.nextScene) {
            const nextSceneData = scenes[choice.nextScene];
            if (nextSceneData.onEnter) {
                nextSceneData.onEnter();
            }
            setCurrentScene(choice.nextScene);
        }
    };
  
      const currentSceneData = scenes[currentScene];
  
    if (!gameStarted) {
        return (
          <GameContainer>
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${titleImage})` 
              }}
            >
              {/* Optional overlay to ensure text remains readable */}
              <div className="absolute inset-0 bg-black/0" /> {/* Adjust opacity (second num) as needed */}
              
              <div className="relative z-10"> {/* This ensures content appears above the overlay */}
                <h1 className="text-5xl font-bold mb-4 font-['Cedarville_Cursive'] text-white">bloom</h1>
                <p className="text-lg mb-8 font-['Cedarville_Cursive'] text-white">a story game</p>
                <Button 
                  onClick={() => setGameStarted(true)}
                  className="bg-[#E4D1B6]/90 hover:border-white text-[#8C5751] backdrop-blur-sm border-2 border-[#8C5751] border-dashed text-base py-3 px-10 font-['Cedarville_Cursive'] rounded-lg"
                >
                  Play
                </Button>
              </div>
            </div>
          </GameContainer>
        );
      }
  
      if (gameStarted && !nameEntered) {
        return (
          <GameContainer>
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${titleImage})`
              }}
            >
              {/* Optional overlay to ensure text remains readable 
              <div className="absolute inset-0 bg-black/10" /> */}
              
              <form onSubmit={handleNameSubmit} className="relative z-10 flex flex-col items-center gap-4">
                <h2 className="text-3xl mb-2 font-['Cedarville_Cursive'] text-white">What is your name?</h2>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-64 text-center bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg border-2 border-[#8C5751] border-dashed text-[#8C5751] font-['Cedarville_Cursive']"
                  placeholder="Enter your name"
                  autoFocus
                />
                <Button 
                  type="submit"
                  disabled={!playerName.trim()}
                  className="bg-[#E4D1B6]/90 hover:border-white text-[#8C5751] backdrop-blur-sm border-2 border-[#8C5751] border-dashed text-base py-3 px-10 font-['Cedarville_Cursive'] rounded-lg"
                >
                  Begin
                </Button>
              </form>
            </div>
          </GameContainer>
        );
      }

      if (showFeedingMinigame) {
        return (
          <GameContainer>
            <GumiFeedingMinigame 
              onComplete={() => {
                setShowFeedingMinigame(false);
                completeTask('fedCat');
                setShowDoorScene(gameState.tookMedicine); // Add this line
                setCurrentScene('bedroom');
              }}
            />
          </GameContainer>
        );
      }
      
      if (showMedicationMinigame) {
        return (
          <GameContainer>
            <MedicationMinigame 
              onComplete={() => {
                setShowMedicationMinigame(false);
                completeTask('tookMedicine');
                setShowDoorScene(gameState.fedCat); // Add this line
                setCurrentScene('bedroom');
              }}
            />
          </GameContainer>
        );
      }

  return (
    <GameContainer>
      <div className="relative h-full flex flex-col justify-center">
        {/* Right Side UI Elements */}
        {currentScene !== 'credits' && (
          <div className="absolute right-4 top-4 bottom-4 flex flex-col items-end space-y-4">
            {/* Inventory */}
            {inventory.length > 0 && (
              <div className="bg-black/50 p-2 rounded-lg backdrop-blur-sm w-16">
                <div className="flex flex-col gap-2 items-center">
                  {inventory.includes('blue flower') && <CloudRain className="w-4 h-4 text-blue-400" />}
                  {inventory.includes('yellow flower') && <Star className="w-4 h-4 text-yellow-400" />}
                  {inventory.includes('red flower') && <Heart className="w-4 h-4 text-red-400" />}<div className="text-sm text-white mb-3 text-center w-full font-['Cedarville_Cursive']">Inventory</div>
                </div>
              </div>
            )}

           {/* Vertical Forest Health Bar */}
            {isInForest(currentScene) && (
            <div className="bg-[#8C5751]0 p-2 rounded-xl backdrop-blur-sm w-16">
                <div className="text-sm text-white mb-3 text-center w-full font-['Cedarville_Cursive']">Forest Health</div>
                <div className="flex justify-center">
                <div className="h-64 w-4 bg-[#E4D1B6] rounded-full overflow-hidden relative border-2 border-[#8C5751] border-dashed">
                    <div 
                    className="w-4 bg-[#295011] transition-all duration-500 absolute bottom-0"
                    style={{
                        height: `${gameState.forestHealth}%`,
                    }}
                    />
                </div>
                </div>
            </div>
            )}
          </div>
        )}

        {/* Background Image Description */}
        <div 
        className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm"
        style={{
            backgroundImage: currentScene === 'bedroom' || currentScene === 'dead_sequence' || currentScene === 'forest_entry' 
            ? currentSceneData.image 
            : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated'
        }}
        >
        {(currentScene !== 'bedroom' && currentScene !== 'dead_sequence' && currentScene !== 'forest_entry') && 
            <p className="text-center px-4">{currentSceneData.image}</p>
        }
        </div>

        {/* Bottom Section - Description and Choices */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 w-full flex flex-col items-center justify-center">
          {/* Description Text */}
          {currentScene === 'credits' ? (
            <div className="flex flex-col items-center text-xl font-bold">
                <h1 className="mb-2 font-['Cedarville_Cursive']">thank you for playing</h1>
                <p className="text-lg font-['Cedarville_Cursive']">built by meghai</p>
            </div>
            ) : currentSceneData.text ? (
            <div className="bg-[#E4D1B6]/90 p-3 rounded-xl border-2 border-[#8C5751] border-dashed mx-auto max-w-md w-full">
                <p className="text-lg text-[#8C5751] whitespace-pre-line font-['Cedarville_Cursive']">
                {processText(currentSceneData.text)}
                </p>
            </div>
            ) : null}

    {/* Choices */}
    {(currentScene === 'final_thoughts' || currentScene === 'red' || currentScene === 'blue' || currentScene === 'yellow') ? (
    <div className="flex flex-col gap-4 items-center">
        <div className="grid grid-cols-3 gap-4 max-w-md w-full mx-auto">
        <Button 
            onClick={() => {
            handleChoice({ nextScene: 'blue' });
            }}
            className={`w-full bg-[#E4D1B6]/90 text-[#8C5751] rounded-lg border-2 ${
            viewedFlowers.blue ? 'border-white' : 'border-[#8C5751]'
            } border-dashed backdrop-blur-sm hover:border-white text-md py-1 h-auto font-['Cedarville_Cursive']`}
        >
            Blue
        </Button>
        <Button 
            onClick={() => {
            handleChoice({ nextScene: 'yellow' });
            }}
            className={`w-full bg-[#E4D1B6]/90 text-[#8C5751] rounded-lg border-2 ${
            viewedFlowers.yellow ? 'border-white' : 'border-[#8C5751]'
            } border-dashed backdrop-blur-sm hover:border-white text-md py-1 h-auto font-['Cedarville_Cursive']`}
        >
            Yellow
        </Button>
        <Button 
            onClick={() => {
            handleChoice({ nextScene: 'red' });
            }}
            className={`w-full bg-[#E4D1B6]/90 text-[#8C5751] rounded-lg border-2 ${
            viewedFlowers.red ? 'border-white' : 'border-[#8C5751]'
            } border-dashed backdrop-blur-sm hover:border-white text-md py-1 h-auto font-['Cedarville_Cursive']`}
        >
            Red
        </Button>
        </div>
        {(viewedFlowers.blue && viewedFlowers.yellow && viewedFlowers.red) && (
        <Button 
            onClick={() => setCurrentScene('credits')}
            className="w-48 bg-[#E4D1B6]/90 text-[#8C5751] rounded-lg border-2 border-[#8C5751] border-dashed backdrop-blur-sm hover:border-white text-md py-1 h-auto font-['Cedarville_Cursive']"
        >
            The End
        </Button>
        )}
    </div>
    ) : (
  
  <div className={`grid ${currentSceneData.choices.filter(choice => !choice.hidden).length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 max-w-md w-full mx-auto`}>
    {currentSceneData.choices.map((choice, index) => {
      if (choice.hidden) {
        return choice.requirementText ? (
          <Button 
            key={index}
            disabled
            className="w-full bg-[#E4D1B6]/90 text-[#8C5751] rounded-lg border-2 border-[#8C5751] border-dashed backdrop-blur-sm text-xs py-1 h-auto"
          >
            {choice.requirementText}
          </Button>
        ) : null;
      }
      return (
        <Button 
          key={index}
          onClick={() => handleChoice(choice)}
          className="w-full bg-[#E4D1B6]/90 text-[#8C5751] rounded-lg border-2 border-[#8C5751] border-dashed backdrop-blur-sm hover:border-white text-md py-1 h-auto font-['Cedarville_Cursive']"
        >
          {processText(choice.text)}
        </Button>
      );
    })}
  </div>
)}
        </div>
      </div>
    </GameContainer>
  );
};

export default BloomGame;
